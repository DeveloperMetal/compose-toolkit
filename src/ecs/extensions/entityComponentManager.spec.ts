import { Controller } from "../../composer";
import { ComponentDoesNotExist } from "../errors/components";
import { EntityDoesNotExist, InvalidEntityAssociation } from "../errors/entities";
import { EVT_ENTITY_ADDED, EVT_ENTITY_REMOVED } from "../events";
import { ComponentID, EntityID, IComponent } from "../types";
import { EntityComponentManager } from "./entityComponentManager";

const makeDummyWorld = () => {
    const dummy = new Controller([]);
    dummy.broadcast = jest.fn();

    return dummy;
}

class TestComponent implements IComponent {
    public var1 = "var1";
}

class TestComponent2 implements IComponent {
    public var2 = "var2";
}

describe("Entity Component Manager", () => {

    it("Add/Remove entity", async () => {
        
        const world = makeDummyWorld();

        const manager = new EntityComponentManager(world);
        const entityID = await manager.addEntity();

        expect(entityID).toBeString();
        expect(manager.entityExists(entityID)).toBeTrue();
        expect(world.broadcast).toHaveBeenCalledWith(EVT_ENTITY_ADDED, entityID);

        await manager.removeEntity(entityID);
        expect(manager.entityExists(entityID)).toBeFalse();
        expect(world.broadcast).toHaveBeenCalledWith(EVT_ENTITY_REMOVED, entityID);
    });

    it("Add/Remove component", async () => {
        const world = makeDummyWorld();
        const manager = new EntityComponentManager(world);
        const entityID = await manager.addEntity();
        const componentID = await manager.addComponent(entityID, TestComponent);
        
        expect(componentID).toBeTruthy();
        expect(manager.entityHasComponent(entityID, TestComponent)).toBeTrue();

        await manager.removeComponent(componentID);
        expect(manager.entityHasComponent(entityID, TestComponent)).toBeFalse();  
    });

    it("Remove entity and all its components", async () => {
        const world = makeDummyWorld();
        const manager = new EntityComponentManager(world);
        const entityID = await manager.addEntity();
        const entityID2 = await manager.addEntity();
        const componentID1 = await manager.addComponent(entityID, TestComponent);
        const componentID2 = await manager.addComponent(entityID, TestComponent2);

        expect(manager.entityExists(entityID)).toBeTrue();
        expect(manager.entityHasComponent(entityID, TestComponent)).toBeTrue();
        expect(manager.entityHasComponent(entityID, TestComponent2)).toBeTrue();

        await manager.removeEntity(entityID);

        expect(manager.entityExists(entityID)).toBeFalse();
        expect(manager.entityHasComponent(entityID, TestComponent)).toBeFalse();
        expect(manager.entityHasComponent(entityID, TestComponent2)).toBeFalse();

        expect(manager.entityExists(entityID2)).toBeTrue();
    });

    it("Error adding component to non existing entity", async () => {
        const world = makeDummyWorld();
        const manager = new EntityComponentManager(world);

        try {
            await manager.addComponent("Bad entity id", TestComponent);
            expect(true).toBeFalse();
        } catch(err:any) {
            expect(err).toBeInstanceOf(EntityDoesNotExist);
        }
    });

    it("Error removing non existing entity", async () => {
        const world = makeDummyWorld();
        const manager = new EntityComponentManager(world);
        try {
            await manager.removeEntity("Bad entity id");
        } catch(err:any) {
            expect(() => { throw err}).toThrow(EntityDoesNotExist);
        }
    });

    it("Error mapping non existing entity", async () => {
        const world = makeDummyWorld();
        const manager = new EntityComponentManager(world);
        try {
            manager.mapEntityComponent("Bad entity id", "some component id", TestComponent);
        } catch(err:any) {
            expect(err).toBeInstanceOf(EntityDoesNotExist);
        }
    });

    it("Error unmapping non existing entity", async () => {
        const world = makeDummyWorld();
        const manager = new EntityComponentManager(world);
        try {
            manager.unmapEntityComponent("Bad entity id", "some component id");
        } catch(err:any) {
            expect(err).toBeInstanceOf(EntityDoesNotExist);
        }
    })

    it("Error removing non existing component", async () => {
        // TODO: Fix typescript error constructor resolution.
        // These test only test if there is an error, not what error type was thrown.

        const world = makeDummyWorld();
        const manager = new EntityComponentManager(world);
        try {
            await manager.removeComponent("Bad component id");
        } catch(err:any) {
            expect(err).toBeInstanceOf(ComponentDoesNotExist);
        }

        // test invalid associations
        try {
            const entityId = await manager.addEntity();
            const compID = await manager.addComponent(entityId, TestComponent);
            const _componentEntityMap: Map<ComponentID, EntityID> = Reflect.get(manager, "_componentEntityMap");
            // force a bad association
            _componentEntityMap.delete(compID);
            await manager.removeComponent(compID);
        } catch(err) {
            expect(err).toBeInstanceOf(InvalidEntityAssociation);
        }
    });

    it("Get component by id", async () => {
        const world = makeDummyWorld();
        const manager = new EntityComponentManager(world);
        const entityID = await manager.addEntity();
        const componentID = await manager.addComponent(entityID, TestComponent);
        
        expect(manager.getComponentById(componentID)).toBeInstanceOf(TestComponent);

        // non existent one
        expect(() => manager.getComponentById("Bad ID")).toThrowError(ComponentDoesNotExist);
    })
});