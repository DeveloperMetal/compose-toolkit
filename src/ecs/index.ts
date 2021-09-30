import { Compose } from "../composer";
import { EVT_BEFORE_INIT } from "../composer/types";
import { EntityComponentManager } from "./extensions/entityComponentManager";
import { PipelineManager } from "./extensions/pipelineManager";
import { SystemMananger } from "./extensions/systemManager";

export class World extends Compose(
    { extension: EntityComponentManager, as: "entities" },
    { extension: SystemMananger, as: "systems" },
    { extension: PipelineManager, as: "pipelines" }
) {
    public entities!: EntityComponentManager;
    public systems!: SystemMananger;
    public pipelines!: PipelineManager;
}