import { Controller, Extension } from "../../composer";
import { IConstructor } from "../../composer/types";
import { EVT_EXEC_PIPELINE } from "../events";
import { ComponentID, IComponent, System } from "../types";
import { EntityComponentManager } from "./entityComponentManager";
import { SystemMananger } from "./systemManager";

const makeDummyWorld = (getComponent?: <T extends Extension>(extension: IConstructor<T>) => T | undefined) => {
    const dummy = new Controller([]);
    dummy.broadcast = jest.fn();
    if (getComponent) {
        dummy.getComponent = jest.fn(getComponent);
    } else {
        dummy.getComponent = jest.fn();
    }

    return dummy;
}

class TestComponent implements IComponent {
    public var1 = "var1";
}

class TestComponent2 implements IComponent {
    public var2 = "var2";
}


describe("System Manager", () => {
    it("Add/remove system", async () => {
        const world = makeDummyWorld();
        const systems = new SystemMananger(world);
        const testSystem: System<TestComponent> = {
            name: "test1",
            pipeline: "default",
            component: TestComponent,
            filter: jest.fn(() => true),
            exec: jest.fn(),
            begin: jest.fn(),
            end: jest.fn()
        };
        const testSystem2: System<TestComponent> = {
            name: "test2",
            pipeline: "default",
            component: TestComponent,
            filter: jest.fn(() => true),
            exec: jest.fn(),
            begin: jest.fn(),
            end: jest.fn()
        };

        systems.addSystem(testSystem);
        systems.addSystem(testSystem2);

        expect(systems.exists("test1")).toBeTrue();
        expect(systems.exists("test2")).toBeTrue();

        systems.removeSystem("test1");
        expect(systems.exists("test1")).toBeFalse();
        expect(systems.exists("test2")).toBeTrue();

        systems.removeSystem("test2");
        expect(systems.exists("test1")).toBeFalse();
        expect(systems.exists("test2")).toBeFalse();

        systems.removeSystem("test1");
        expect(systems.exists("test1")).toBeFalse();

    });

    it("Execute System Simple", async () => {
        const mockComponent = new TestComponent();
        const world = makeDummyWorld();
        const systems = new SystemMananger(world);
        const testSystem: System<TestComponent> = {
            name: "test",
            pipeline: "default",
            component: TestComponent,
            exec: jest.fn()
        };

        systems.addSystem(testSystem);

        const testQueue = new Set();
        testQueue.add(mockComponent);

        // force pipeline EVT_EXEC_PIPELINE event call
        const norun = await Reflect.apply(Reflect.get(systems, EVT_EXEC_PIPELINE), systems, ["default", TestComponent, testQueue]);
        
        expect(testSystem.exec).toHaveBeenCalledTimes(1);
        expect(testSystem.exec).toHaveBeenCalledWith(mockComponent);
        
        expect(norun).toBeTrue();
    });

    it("Execute System - no filter", async () => {
        const mockComponent = new TestComponent();
        const world = makeDummyWorld();
        const systems = new SystemMananger(world);
        const testSystem: System<TestComponent> = {
            name: "test",
            pipeline: "default",
            component: TestComponent,
            filter: jest.fn(() => true),
            exec: jest.fn(),
            begin: jest.fn(),
            end: jest.fn()
        };

        systems.addSystem(testSystem);

        const testQueue = new Set();
        testQueue.add(mockComponent);

        // force pipeline EVT_EXEC_PIPELINE event call
        const norun = await Reflect.apply(Reflect.get(systems, EVT_EXEC_PIPELINE), systems, ["default", TestComponent, testQueue]);

        expect(testSystem.begin).toHaveBeenCalledTimes(1);
        expect(testSystem.begin).toHaveBeenCalledWith("default", 1);
        
        expect(testSystem.exec).toHaveBeenCalledTimes(1);
        expect(testSystem.exec).toHaveBeenCalledWith(mockComponent);
        
        expect(testSystem.end).toHaveBeenCalledTimes(1);
        expect(testSystem.end).toHaveBeenCalledWith("default", 1);

        expect(norun).toBeTrue();
    });

    it("Execute System", async () => {
        const mockComponent = new TestComponent();
        const world = makeDummyWorld();
        const systems = new SystemMananger(world);
        const testSystem: System<TestComponent> = {
            name: "test",
            pipeline: "default",
            component: TestComponent,
            filter: jest.fn(() => true),
            exec: jest.fn(),
            begin: jest.fn(),
            end: jest.fn()
        };

        systems.addSystem(testSystem);

        const testQueue = new Set();
        testQueue.add(mockComponent);

        // force pipeline EVT_EXEC_PIPELINE event call
        const norun = await Reflect.apply(Reflect.get(systems, EVT_EXEC_PIPELINE), systems, ["default", TestComponent, testQueue]);

        expect(testSystem.filter).toHaveBeenCalledTimes(testQueue.size);
        expect(testSystem.filter).toHaveBeenCalledWith(mockComponent);

        expect(testSystem.begin).toHaveBeenCalledTimes(1);
        expect(testSystem.begin).toHaveBeenCalledWith("default", 1);
        
        expect(testSystem.exec).toHaveBeenCalledTimes(1);
        expect(testSystem.exec).toHaveBeenCalledWith(mockComponent);
        
        expect(testSystem.end).toHaveBeenCalledTimes(1);
        expect(testSystem.end).toHaveBeenCalledWith("default", 1);

        expect(norun).toBeTrue();
    });

    it("Execute System - fail filter", async () => {
        const mockComponent = new TestComponent();
        const world = makeDummyWorld();
        const systems = new SystemMananger(world);
        const testSystem: System<TestComponent> = {
            name: "test",
            pipeline: "default",
            component: TestComponent,
            filter: jest.fn(() => false),
            exec: jest.fn()
        };

        systems.addSystem(testSystem);

        const testQueue = new Set();
        testQueue.add(mockComponent);

        // force pipeline EVT_EXEC_PIPELINE event call
        const norun = await Reflect.apply(Reflect.get(systems, EVT_EXEC_PIPELINE), systems, ["default", TestComponent, testQueue]);

        expect(testSystem.filter).toHaveBeenCalledTimes(testQueue.size);
        expect(testSystem.filter).toHaveBeenCalledWith(mockComponent);
        
        expect(testSystem.exec).toHaveBeenCalledTimes(0);
        
        expect(norun).toBeTrue();
    });

    it("Skip non existent systems", async () => {
        const world = makeDummyWorld();
        const systems = new SystemMananger(world);
        const testQueue = new Set();

        // force pipeline EVT_EXEC_PIPELINE event call
        const norun = await Reflect.apply(Reflect.get(systems, EVT_EXEC_PIPELINE), systems, ["default", TestComponent, testQueue]);

        expect(norun).toBeFalse();
    })
});