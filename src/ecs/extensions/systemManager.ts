import { Controller, Extension } from "../../composer";
import { IConstructor } from "../../composer/types";
import { EVT_EXEC_PIPELINE } from "../events";
import { IComponent, System } from "../types";

/**
 * Manages systems execution
 */
export class SystemMananger extends Extension {

    protected _systems = new Map<IConstructor<IComponent>, Set<System<any>>>();
    protected _systemEntry = new Map<string, System<any>>();

    constructor(controller: Controller) {
        super(controller);
    }

    /**
     * Adds a system definition to manage execute
     * @param system The system to register
     */
    addSystem<T extends IComponent>(system: System<T>) {
        if ( !this._systems.has(system.component) ) {
            this._systems.set(system.component, new Set());
        }

        const systemSet = this._systems.get(system.component) as Set<System<any>>;
        systemSet.add(system);
        this._systemEntry.set(system.name, system);
    }

    /**
     * Removes a system
     * @param name A system to remove by its name
     */
    removeSystem(name: string) {
        const system = this._systemEntry.get(name);
        if ( system ) {
            const systemSet = this._systems.get(system.component) as Set<System<any>>;
            systemSet.delete(system);
            this._systemEntry.delete(name);
            if ( systemSet.size == 0 ) {
                this._systems.delete(system.component);
            }
        }
    }

    /**
     * Returns true if a system was defined with the provided name.
     * @param name THe system's name to check.
     * @returns True if the system exists.
     */
    exists(name: string) {
        return this._systemEntry.has(name);
    }

    /**
     * Event handler to execute systems when specific pipelines are scheduled to run.
     * @param pipeline The pipeline running
     * @param componentCtor The component constructor
     * @param queue A queue of component instances
     */
    async [EVT_EXEC_PIPELINE](pipeline: string, componentCtor: IConstructor<IComponent>, queue: Set<IComponent>) {
        const promises:Promise<void>[] = [];
        const systemSet = this._systems.get(componentCtor);
        if ( !systemSet ) {
            return false;
        }
 
        for(const system of systemSet.values()) {
            if ( system.begin ) {
                system.begin(pipeline, queue.size);
            }

            let runCount = 0;
            for (const component of queue.values()) {
                const runSystem = system.filter?system.filter(component):true;

                if ( runSystem ) {
                    promises.push(Promise.resolve(system.exec(component)));
                    runCount++;
                }
            }

            await Promise.allSettled(promises);

            if ( system.end ) {
                system.end(pipeline, runCount);
            }
        }

        return true;
    }
}