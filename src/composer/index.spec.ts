import { Compose, Extension } from ".";
import { EVT_AFTER_INIT, EVT_BEFORE_INIT, EVT_BROADCAST, EVT_INIT } from "./types";

class Extension1 extends Extension {
}

class Extension2 extends Extension {
}

describe("Define controller", () => {
    it("Compose", () => {
        const Ctor = Compose(Extension1, Extension2);
        const ctrl = new Ctor();

        const returnedExt1 = ctrl.getComponent(Extension1);
        const returnedExt2 = ctrl.getComponent(Extension2);
        expect(returnedExt1).toBeTruthy();
        expect(returnedExt2).toBeTruthy();
        if ( returnedExt1 ) {
            expect(returnedExt1.constructor).toBe(Extension1);
        }
        if (returnedExt2) {
            expect(returnedExt2.constructor).toBe(Extension2);
        }
    });

    it("Compose with named extensions", () => {
        const Ctor = Compose(
            { extension: Extension1, as: "extension1"},
            { extension: Extension2, as: "extension2"}
        );
        const ctrl = new Ctor();

        expect(Reflect.has(ctrl, "extension1")).toBeTrue();
        expect(Reflect.has(ctrl, "extension2")).toBeTrue();
        expect(Reflect.get(ctrl, "extension1")).toBe(ctrl.getComponent(Extension1));
        expect(Reflect.get(ctrl, "extension2")).toBe(ctrl.getComponent(Extension2));
    })

    it("initialized", async () => {
        const Ctor = Compose(Extension1, Extension2);
        const ctrl = new Ctor();

        expect(ctrl.initialized).toBeFalsy();

        await ctrl.init();

        expect(ctrl.initialized).toBeTruthy();
    })
})

describe("Events", () => {
    it("Broadcast", async () => {
        const Ctor = Compose(Extension1, Extension2);
        const ctrl = new Ctor();

        const returnedExt1 = ctrl.getComponent(Extension1);
        const returnedExt2 = ctrl.getComponent(Extension2);

        const ext1BeforeInitMock = jest.fn();
        const ext1InitMock = jest.fn();
        const ext1AfterInit = jest.fn();

        const ext2BeforeInitMock = jest.fn();
        const ext2InitMock = jest.fn();
        const ext2AfterInit = jest.fn();

        if ( returnedExt1 ) {
            Reflect.set(returnedExt1, EVT_BEFORE_INIT, ext1BeforeInitMock);
            Reflect.set(returnedExt1, EVT_INIT, ext1InitMock);
            Reflect.set(returnedExt1, EVT_AFTER_INIT, ext1AfterInit);
        }

        if ( returnedExt2 ) {
            Reflect.set(returnedExt2, EVT_BEFORE_INIT, ext2BeforeInitMock);
            Reflect.set(returnedExt2, EVT_INIT, ext2InitMock);
            Reflect.set(returnedExt2, EVT_AFTER_INIT, ext2AfterInit);
        }

        await ctrl.init();

        expect(ext1BeforeInitMock).toHaveBeenCalledTimes(1);
        expect(ext1InitMock).toHaveBeenCalledTimes(1);
        expect(ext1AfterInit).toHaveBeenCalledTimes(1);

        expect(ext2BeforeInitMock).toHaveBeenCalledTimes(1);
        expect(ext2InitMock).toHaveBeenCalledTimes(1);
        expect(ext2AfterInit).toHaveBeenCalledTimes(1);

        expect(ext1BeforeInitMock).toHaveBeenCalledBefore(ext1InitMock);
        expect(ext1InitMock).toHaveBeenCalledBefore(ext1AfterInit);
        expect(ext1AfterInit).toHaveBeenCalledAfter(ext1BeforeInitMock);

        expect(ext2BeforeInitMock).toHaveBeenCalledBefore(ext2InitMock);
        expect(ext2InitMock).toHaveBeenCalledBefore(ext2AfterInit);
        expect(ext2AfterInit).toHaveBeenCalledAfter(ext2BeforeInitMock);

        expect(ext1BeforeInitMock).toHaveBeenCalledBefore(ext2BeforeInitMock);
        expect(ext1InitMock).toHaveBeenCalledBefore(ext2InitMock);
        expect(ext1AfterInit).toHaveBeenCalledBefore(ext2AfterInit);
    });

    it("add/remove event listener", async () => {
        const Ctor = Compose(Extension1, Extension2);
        const ctrl = new Ctor();

        const testMock = jest.fn();
        const testMock2 = jest.fn();

        ctrl.on("test", testMock);
        ctrl.on("test", testMock2);

        await ctrl.broadcast("test", 1, 2, 3);

        expect(testMock).toHaveBeenCalledTimes(1);
        expect(testMock).toHaveBeenCalledWith(ctrl, 1, 2, 3);
        expect(testMock2).toHaveBeenCalledTimes(1);
        expect(testMock2).toHaveBeenCalledWith(ctrl, 1, 2, 3);

        ctrl.off("test", testMock);

        await ctrl.broadcast("test", 4, 5, 6);

        expect(testMock).toHaveBeenCalledTimes(1);
        expect(testMock2).toHaveBeenCalledTimes(2);
        expect(testMock2).toHaveBeenCalledWith(ctrl, 4, 5, 6);
    });

    it("event forwarding", async () => {
        const Ctor = Compose(Extension1, Extension2);
        const ctrl = new Ctor();

        const ext1 = ctrl.getComponent(Extension1);
        const testMock = jest.fn();
        
        if ( ext1 ) {
            Reflect.set(ext1, EVT_BROADCAST, testMock);
        }

        await ctrl.broadcast("test");

        expect(testMock).toHaveBeenCalledTimes(1);
        expect(testMock).toHaveBeenCalledWith("test");
    });

    it("once event", async () => {
        const Ctor = Compose(Extension1, Extension2);
        const ctrl = new Ctor();
        const testCallback = jest.fn();
        const testCallback2 = jest.fn();

        ctrl.once("test", testCallback);
        ctrl.once("test", testCallback2);

        await ctrl.broadcast("test");
        await ctrl.broadcast("test");

        expect(testCallback).toHaveBeenCalledTimes(1);
        expect(testCallback2).toHaveBeenCalledTimes(1);
    })

    it("remove non existent listener", () => {
        const Ctor = Compose(Extension1, Extension2);
        const ctrl = new Ctor();
        
        expect(ctrl.off("no event", () => {})).toBe(ctrl);
    });

    it("extension broadcast", async () => {
        const Ctor = Compose(Extension1, Extension2);
        const ctrl = new Ctor();

        const mockBroadcast = jest.fn();
        Reflect.set(ctrl, "broadcast", mockBroadcast);

        const ext1 = ctrl.getComponent(Extension1);
        if ( ext1 ) {
            const broadcast = Reflect.get(ext1, "broadcast");
            await Reflect.apply(broadcast, ext1, ["test", 1, 2, 3]);
        }


        expect(mockBroadcast).toHaveBeenCalledTimes(1);
        expect(mockBroadcast).toHaveBeenCalledWith("test", 1, 2, 3);
    });
});