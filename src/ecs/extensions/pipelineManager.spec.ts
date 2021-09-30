import { Extension, Controller } from "../../composer";
import { IConstructor } from "../../composer/types";
import { EVT_EXEC_PIPELINE } from "../events";
import { IComponent } from "../types";
import { PipelineManager } from "./pipelineManager";

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

class DummyComponent implements IComponent { }

describe("Pipelines", () => {
    it("Enqueue pipeline / object", () => {
        const world = makeDummyWorld();
        const pipelineMan = new PipelineManager(world);
        const dummyComp = new DummyComponent();

        const _pipeline = Reflect.get(pipelineMan, "_pipeline") as Map<string, Map<IConstructor<IComponent>, Set<IComponent>>>;

        pipelineMan.enqueue(dummyComp);

        expect(_pipeline.has("default")).toBeTrue();
        expect(_pipeline.get("default")?.get(DummyComponent)).toBeTruthy()
        expect(_pipeline.get("default")?.get(DummyComponent)?.has(dummyComp)).toBeTrue();
    });

    it("Enqueue pipeline / object non default", () => {
        const world = makeDummyWorld();
        const pipelineMan = new PipelineManager(world);
        const dummyComp = new DummyComponent();
        const pipelineName = "test";

        const _pipeline = Reflect.get(pipelineMan, "_pipeline") as Map<string, Map<IConstructor<IComponent>, Set<IComponent>>>;

        pipelineMan.enqueue(dummyComp, pipelineName);

        expect(_pipeline.has(pipelineName)).toBeTrue();
        expect(_pipeline.get(pipelineName)?.get(DummyComponent)).toBeTruthy()
        expect(_pipeline.get(pipelineName)?.get(DummyComponent)?.has(dummyComp)).toBeTrue();
    });

    it("Enqueue pipeline / id", () => {
        const world = makeDummyWorld();
        const pipelineMan = new PipelineManager(world);
        const dummyComp = new DummyComponent();

        const _pipeline = Reflect.get(pipelineMan, "_pipeline") as Map<string, Map<IConstructor<IComponent>, Set<IComponent>>>;

        Reflect.defineProperty(pipelineMan, "entityManager", {
            writable: false,
            value: {
                getComponentById: jest.fn(() => dummyComp)
            }
        });

        pipelineMan.enqueue("123");

        expect(_pipeline.has("default")).toBeTrue();
        expect(_pipeline.get("default")?.get(DummyComponent)).toBeTruthy()
        expect(_pipeline.get("default")?.get(DummyComponent)?.has(dummyComp)).toBeTrue();
    });

    it("Execute pipeline", async () => {
        const world = makeDummyWorld();
        const pipelineMan = new PipelineManager(world);
        const dummyComp = new DummyComponent();
        const dummyComp2 = new DummyComponent();
        const broadcastMock = jest.fn()
        const pipelineName = "default"

        Reflect.set(pipelineMan, "broadcast", broadcastMock)

        pipelineMan.enqueue(dummyComp);
        pipelineMan.enqueue(dummyComp2);
        await expect(pipelineMan.execute()).toResolve();

        expect(broadcastMock).toHaveBeenCalledWith(EVT_EXEC_PIPELINE, pipelineName, new Set([dummyComp, dummyComp2]));

        // a second call should not trigger anythign since queue is empty now
        await expect(pipelineMan.execute()).toResolve();

        expect(broadcastMock).toHaveBeenCalledTimes(1);

    });

    it("No execute nonexistent pipeline", async () => {
        const world = makeDummyWorld();
        const pipelineMan = new PipelineManager(world);
        const broadcastMock = jest.fn()
        const pipelineName = "non-existent"
        Reflect.set(pipelineMan, "broadcast", broadcastMock)
        await expect(pipelineMan.execute(pipelineName)).toResolve();
        expect(broadcastMock).toHaveBeenCalledTimes(0);
    });
});