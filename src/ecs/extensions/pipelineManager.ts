import { Controller, Extension } from "../../composer";
import { ExtensionMissing } from "../../composer/errors";
import { IConstructor } from "../../composer/types";
import { EVT_EXEC_PIPELINE } from "../events";
import { ComponentID, IComponent, System } from "../types";
import { EntityComponentManager } from "./entityComponentManager";

export class PipelineManager extends Extension {
    protected _pipeline = new Map<string, Map<IConstructor<IComponent>, Set<IComponent>>>();
    public readonly entityManager: EntityComponentManager;

    constructor(controller: Controller) {
        super(controller);

        this.entityManager = this.controller.getComponent(EntityComponentManager) as EntityComponentManager
    }

    /**
     * 
     * @param component 
     * @param pipeline The pipeline to enqueue a component onto.
     */
    enqueue(component: IComponent | ComponentID, pipeline: string = "default") {
        // create pipeline if one doesn't exist
        if (!this._pipeline.has(pipeline)) {
            this._pipeline.set(pipeline, new Map());
        }

        const componentInstance = typeof component === "object" ? component : this.entityManager.getComponentById(component);
        const componentCtor = componentInstance.constructor as IConstructor<IComponent>;
        const pipelineCompMap = this._pipeline.get(pipeline) as WeakMap<IConstructor<IComponent>, Set<IComponent>>;
        if (!pipelineCompMap.has(componentCtor)) {
            pipelineCompMap.set(componentCtor, new Set());
        }
        const pipelineQueue = pipelineCompMap.get(componentCtor) as Set<IComponent>;
        pipelineQueue.add(componentInstance);
    }

    async execute(pipeline: string = "default") {
        const queue = this._pipeline.get(pipeline);

        if (queue) {
            for (const [pipelineName, queueMap] of this._pipeline.entries()) {
                for (const [Ctor, queue] of queueMap.entries()) {
                    if (queue.size > 0) {
                        // TODO: Due to posibility of components entering the queue while a system runs
                        // We need assign a new queu instance. 
                        //
                        // There is a chance here to optimize by not creating new
                        // sets on every call to execute. We could probably swap sets between calls
                        // and empty them instead of new Set(). Need to test performance between clear and new.
                        queueMap.set(Ctor, new Set());
                        await this.broadcast(EVT_EXEC_PIPELINE, pipelineName, queue);
                    }
                }
            }
        }
    }
}