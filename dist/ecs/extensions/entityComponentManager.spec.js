"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var composer_1 = require("../../composer");
var components_1 = require("../errors/components");
var entities_1 = require("../errors/entities");
var events_1 = require("../events");
var entityComponentManager_1 = require("./entityComponentManager");
var makeDummyWorld = function () {
    var dummy = new composer_1.Controller([]);
    dummy.broadcast = jest.fn();
    return dummy;
};
var TestComponent = /** @class */ (function () {
    function TestComponent() {
        this.var1 = "var1";
    }
    return TestComponent;
}());
var TestComponent2 = /** @class */ (function () {
    function TestComponent2() {
        this.var2 = "var2";
    }
    return TestComponent2;
}());
describe("Entity Component Manager", function () {
    it("Add/Remove entity", function () { return __awaiter(void 0, void 0, void 0, function () {
        var world, manager, entityID;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = makeDummyWorld();
                    manager = new entityComponentManager_1.EntityComponentManager(world);
                    return [4 /*yield*/, manager.addEntity()];
                case 1:
                    entityID = _a.sent();
                    expect(entityID).toBeString();
                    expect(manager.entityExists(entityID)).toBeTrue();
                    expect(world.broadcast).toHaveBeenCalledWith(events_1.EVT_ENTITY_ADDED, entityID);
                    return [4 /*yield*/, manager.removeEntity(entityID)];
                case 2:
                    _a.sent();
                    expect(manager.entityExists(entityID)).toBeFalse();
                    expect(world.broadcast).toHaveBeenCalledWith(events_1.EVT_ENTITY_REMOVED, entityID);
                    return [2 /*return*/];
            }
        });
    }); });
    it("Add/Remove component", function () { return __awaiter(void 0, void 0, void 0, function () {
        var world, manager, entityID, componentID;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = makeDummyWorld();
                    manager = new entityComponentManager_1.EntityComponentManager(world);
                    return [4 /*yield*/, manager.addEntity()];
                case 1:
                    entityID = _a.sent();
                    return [4 /*yield*/, manager.addComponent(entityID, TestComponent)];
                case 2:
                    componentID = _a.sent();
                    expect(componentID).toBeTruthy();
                    expect(manager.entityHasComponent(entityID, TestComponent)).toBeTrue();
                    return [4 /*yield*/, manager.removeComponent(componentID)];
                case 3:
                    _a.sent();
                    expect(manager.entityHasComponent(entityID, TestComponent)).toBeFalse();
                    return [2 /*return*/];
            }
        });
    }); });
    it("Remove entity and all its components", function () { return __awaiter(void 0, void 0, void 0, function () {
        var world, manager, entityID, entityID2, componentID1, componentID2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = makeDummyWorld();
                    manager = new entityComponentManager_1.EntityComponentManager(world);
                    return [4 /*yield*/, manager.addEntity()];
                case 1:
                    entityID = _a.sent();
                    return [4 /*yield*/, manager.addEntity()];
                case 2:
                    entityID2 = _a.sent();
                    return [4 /*yield*/, manager.addComponent(entityID, TestComponent)];
                case 3:
                    componentID1 = _a.sent();
                    return [4 /*yield*/, manager.addComponent(entityID, TestComponent2)];
                case 4:
                    componentID2 = _a.sent();
                    expect(manager.entityExists(entityID)).toBeTrue();
                    expect(manager.entityHasComponent(entityID, TestComponent)).toBeTrue();
                    expect(manager.entityHasComponent(entityID, TestComponent2)).toBeTrue();
                    return [4 /*yield*/, manager.removeEntity(entityID)];
                case 5:
                    _a.sent();
                    expect(manager.entityExists(entityID)).toBeFalse();
                    expect(manager.entityHasComponent(entityID, TestComponent)).toBeFalse();
                    expect(manager.entityHasComponent(entityID, TestComponent2)).toBeFalse();
                    expect(manager.entityExists(entityID2)).toBeTrue();
                    return [2 /*return*/];
            }
        });
    }); });
    it("Error adding component to non existing entity", function () { return __awaiter(void 0, void 0, void 0, function () {
        var world, manager, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = makeDummyWorld();
                    manager = new entityComponentManager_1.EntityComponentManager(world);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, manager.addComponent("Bad entity id", TestComponent)];
                case 2:
                    _a.sent();
                    expect(true).toBeFalse();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    expect(err_1).toBeInstanceOf(entities_1.EntityDoesNotExist);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    it("Error removing non existing entity", function () { return __awaiter(void 0, void 0, void 0, function () {
        var world, manager, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = makeDummyWorld();
                    manager = new entityComponentManager_1.EntityComponentManager(world);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, manager.removeEntity("Bad entity id")];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    expect(function () { throw err_2; }).toThrow(entities_1.EntityDoesNotExist);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    it("Error mapping non existing entity", function () { return __awaiter(void 0, void 0, void 0, function () {
        var world, manager;
        return __generator(this, function (_a) {
            world = makeDummyWorld();
            manager = new entityComponentManager_1.EntityComponentManager(world);
            try {
                manager.mapEntityComponent("Bad entity id", "some component id", TestComponent);
            }
            catch (err) {
                expect(err).toBeInstanceOf(entities_1.EntityDoesNotExist);
            }
            return [2 /*return*/];
        });
    }); });
    it("Error unmapping non existing entity", function () { return __awaiter(void 0, void 0, void 0, function () {
        var world, manager;
        return __generator(this, function (_a) {
            world = makeDummyWorld();
            manager = new entityComponentManager_1.EntityComponentManager(world);
            try {
                manager.unmapEntityComponent("Bad entity id", "some component id");
            }
            catch (err) {
                expect(err).toBeInstanceOf(entities_1.EntityDoesNotExist);
            }
            return [2 /*return*/];
        });
    }); });
    it("Error removing non existing component", function () { return __awaiter(void 0, void 0, void 0, function () {
        var world, manager, err_3, entityId, compID, _componentEntityMap, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = makeDummyWorld();
                    manager = new entityComponentManager_1.EntityComponentManager(world);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, manager.removeComponent("Bad component id")];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    expect(err_3).toBeInstanceOf(components_1.ComponentDoesNotExist);
                    return [3 /*break*/, 4];
                case 4:
                    _a.trys.push([4, 8, , 9]);
                    return [4 /*yield*/, manager.addEntity()];
                case 5:
                    entityId = _a.sent();
                    return [4 /*yield*/, manager.addComponent(entityId, TestComponent)];
                case 6:
                    compID = _a.sent();
                    _componentEntityMap = Reflect.get(manager, "_componentEntityMap");
                    // force a bad association
                    _componentEntityMap.delete(compID);
                    return [4 /*yield*/, manager.removeComponent(compID)];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 8:
                    err_4 = _a.sent();
                    expect(err_4).toBeInstanceOf(entities_1.InvalidEntityAssociation);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); });
    it("Get component by id", function () { return __awaiter(void 0, void 0, void 0, function () {
        var world, manager, entityID, componentID;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = makeDummyWorld();
                    manager = new entityComponentManager_1.EntityComponentManager(world);
                    return [4 /*yield*/, manager.addEntity()];
                case 1:
                    entityID = _a.sent();
                    return [4 /*yield*/, manager.addComponent(entityID, TestComponent)];
                case 2:
                    componentID = _a.sent();
                    expect(manager.getComponentById(componentID)).toBeInstanceOf(TestComponent);
                    // non existent one
                    expect(function () { return manager.getComponentById("Bad ID"); }).toThrowError(components_1.ComponentDoesNotExist);
                    return [2 /*return*/];
            }
        });
    }); });
});
