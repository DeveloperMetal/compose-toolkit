import { Controller, Extension } from "../../composer";
import { IConstructor } from "../../composer/types";
import { ComponentID, EntityID, IComponent } from "../types";
import hyperid from "hyperid";
import { EVT_COMPONENT_ADDED, EVT_COMPONENT_REMOVED, EVT_ENTITY_ADDED, EVT_ENTITY_REMOVED } from "../events";
import { EntityDoesNotExist, InvalidEntityAssociation } from "../errors/entities";
import { ComponentDoesNotExist } from "../errors/components";

export class EntityComponentManager extends Extension {

    protected _entities = new Set<EntityID>();
    protected _components = new Map<ComponentID, IComponent>();
    protected _entityComponentMap = new Map<EntityID, Map<string, ComponentID>>();
    protected _componentEntityMap = new Map<ComponentID, EntityID>();
    protected _componentCtorMap = new WeakMap<IConstructor<IComponent>, ComponentID>();

    protected _idGen = hyperid();

    constructor(controller: Controller) {
        super(controller);
    }


    entityExists(entityId: EntityID) {
        return this._entities.has(entityId);
    }

    /**
     * Checks if an entity contains a component
     * @param entityId The entity id
     * @param component The component constructor to check for
     * @returns True if component exists
     */
    entityHasComponent(entityId: EntityID, component: IConstructor<IComponent>) {
        return this._entityComponentMap.get(entityId)?.has(component.name) || false;
    }

    /**
     * Finds a component by id
     * @param componentId The component id to find
     * @returns A component instance
     */
    getComponentById(componentId: ComponentID) {
        const comp = this._components.get(componentId);
        if ( !comp) {
            throw new ComponentDoesNotExist(componentId);
        }

        return comp;
    }

    /**
     * Adds a new entity to the system
     * @returns The new entity id
     */
    async addEntity() {
        const newId = this._idGen();
        this._entities.add(newId);
        this._entityComponentMap.set(newId, new Map<string, ComponentID>());

        await this.broadcast(EVT_ENTITY_ADDED, newId);
        return newId;
    }

    /**
     * Will remove an entity and its components from the system.
     * @param id The id of the entity to remove.
     */
    async removeEntity(id: EntityID) {
        if (!this._entities.has(id)) {
            throw new EntityDoesNotExist(id);
        }

        this._entities.delete(id);
        const entityComponents = this._entityComponentMap.get(id) as Map<string, ComponentID>;
        for (const componentID of entityComponents.values()) {
            await this.removeComponent(componentID);
        }
        this._entityComponentMap.delete(id);
        await this.broadcast(EVT_ENTITY_REMOVED, id);
    }

    /**
     * Dual map of entity <-> component ids
     * @param entityId The entity to map with component
     * @param componentId The component to map with entity
     */
    mapEntityComponent(entityId: EntityID, componentId: ComponentID, componentCtor: IConstructor<IComponent>) {
        const entityMap = this._entityComponentMap.get(entityId);
        if ( !entityMap) {
            throw new EntityDoesNotExist(entityId);
        }

        entityMap.set(componentCtor.name, componentId);
        this._componentEntityMap.set(componentId, entityId);
        this._componentCtorMap.set(componentCtor, componentId);
    }

    /**
     * Dual unmap of entity <-> component ids
     * @param entityId The entity to unmap the provided component
     * @param componentId The component to unmap from the provided entity id
     */
    unmapEntityComponent(entityId: EntityID, componentId: ComponentID) {
        let componentName: string | undefined
        const entityMap = this._entityComponentMap.get(entityId);

        if (!entityMap) {
            throw new EntityDoesNotExist(entityId);
        }

        // find component name from in entry map by its id
        for (const [ctor, id] of entityMap.entries()) {
            if (id === componentId) {
                componentName = ctor;
                break;
            }
        }

        if ( componentName ) {
            this._entityComponentMap.get(entityId)?.delete(componentName);
        }

        const component = this._components.get(componentId);
        if (component) {
            this._componentCtorMap.delete(component.constructor as IConstructor<IComponent>);
        }
        this._componentEntityMap.delete(componentId);
    }

    /**
     * Instantiates a component and associates it to the provided entity id
     * @param entityId Entity id to associate new component instance to.
     * @param componentCtor A component constructor that implements IComponent
     * @returns The new component id
     */
    async addComponent(entityId: EntityID, componentCtor: IConstructor<IComponent>) {
        if (!this._entities.has(entityId)) {
            throw new EntityDoesNotExist(entityId);
        }

        const component = new componentCtor();
        const componentId = this._idGen();
        this._components.set(componentId, component);
        this.mapEntityComponent(entityId, componentId, componentCtor);

        await this.broadcast(EVT_COMPONENT_ADDED, entityId, componentId, component);

        return componentId;
    }

    /**
     * Removes a component from the system and entity association
     * @param componentId The component id to remove
     */
    async removeComponent(componentId: ComponentID) {
        const component = this._components.get(componentId);

        if ( !component ) {
            throw new ComponentDoesNotExist(componentId);
        }

        const entityId: EntityID | undefined = this._componentEntityMap.get(componentId);
        if (!entityId) {
            throw new InvalidEntityAssociation();
        }

        // remove maps
        this.unmapEntityComponent(entityId, componentId);

        // finally remove component itself
        this._components.delete(componentId);
        await this.broadcast(EVT_COMPONENT_REMOVED, entityId, componentId, component);
    }
}