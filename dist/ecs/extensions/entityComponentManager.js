"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityComponentManager = void 0;
var composer_1 = require("../../composer");
var hyperid_1 = __importDefault(require("hyperid"));
var events_1 = require("../events");
var entities_1 = require("../errors/entities");
var components_1 = require("../errors/components");
var EntityComponentManager = /** @class */ (function (_super) {
    __extends(EntityComponentManager, _super);
    function EntityComponentManager(controller) {
        var _this = _super.call(this, controller) || this;
        _this._entities = new Set();
        _this._components = new Map();
        _this._entityComponentMap = new Map();
        _this._componentEntityMap = new Map();
        _this._componentCtorMap = new WeakMap();
        _this._idGen = (0, hyperid_1.default)();
        return _this;
    }
    EntityComponentManager.prototype.entityExists = function (entityId) {
        return this._entities.has(entityId);
    };
    /**
     * Checks if an entity contains a component
     * @param entityId The entity id
     * @param component The component constructor to check for
     * @returns True if component exists
     */
    EntityComponentManager.prototype.entityHasComponent = function (entityId, component) {
        var _a;
        return ((_a = this._entityComponentMap.get(entityId)) === null || _a === void 0 ? void 0 : _a.has(component.name)) || false;
    };
    /**
     * Finds a component by id
     * @param componentId The component id to find
     * @returns A component instance
     */
    EntityComponentManager.prototype.getComponentById = function (componentId) {
        var comp = this._components.get(componentId);
        if (!comp) {
            throw new components_1.ComponentDoesNotExist(componentId);
        }
        return comp;
    };
    /**
     * Adds a new entity to the system
     * @returns The new entity id
     */
    EntityComponentManager.prototype.addEntity = function () {
        return __awaiter(this, void 0, void 0, function () {
            var newId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newId = this._idGen();
                        this._entities.add(newId);
                        this._entityComponentMap.set(newId, new Map());
                        return [4 /*yield*/, this.broadcast(events_1.EVT_ENTITY_ADDED, newId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, newId];
                }
            });
        });
    };
    /**
     * Will remove an entity and its components from the system.
     * @param id The id of the entity to remove.
     */
    EntityComponentManager.prototype.removeEntity = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var entityComponents, _a, _b, componentID, e_1_1;
            var e_1, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!this._entities.has(id)) {
                            throw new entities_1.EntityDoesNotExist(id);
                        }
                        this._entities.delete(id);
                        entityComponents = this._entityComponentMap.get(id);
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 8]);
                        _a = __values(entityComponents.values()), _b = _a.next();
                        _d.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 5];
                        componentID = _b.value;
                        return [4 /*yield*/, this.removeComponent(componentID)];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        this._entityComponentMap.delete(id);
                        return [4 /*yield*/, this.broadcast(events_1.EVT_ENTITY_REMOVED, id)];
                    case 9:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Dual map of entity <-> component ids
     * @param entityId The entity to map with component
     * @param componentId The component to map with entity
     */
    EntityComponentManager.prototype.mapEntityComponent = function (entityId, componentId, componentCtor) {
        var entityMap = this._entityComponentMap.get(entityId);
        if (!entityMap) {
            throw new entities_1.EntityDoesNotExist(entityId);
        }
        entityMap.set(componentCtor.name, componentId);
        this._componentEntityMap.set(componentId, entityId);
        this._componentCtorMap.set(componentCtor, componentId);
    };
    /**
     * Dual unmap of entity <-> component ids
     * @param entityId The entity to unmap the provided component
     * @param componentId The component to unmap from the provided entity id
     */
    EntityComponentManager.prototype.unmapEntityComponent = function (entityId, componentId) {
        var e_2, _a;
        var _b;
        var componentName;
        var entityMap = this._entityComponentMap.get(entityId);
        if (!entityMap) {
            throw new entities_1.EntityDoesNotExist(entityId);
        }
        try {
            // find component name from in entry map by its id
            for (var _c = __values(entityMap.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = __read(_d.value, 2), ctor = _e[0], id = _e[1];
                if (id === componentId) {
                    componentName = ctor;
                    break;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
        if (componentName) {
            (_b = this._entityComponentMap.get(entityId)) === null || _b === void 0 ? void 0 : _b.delete(componentName);
        }
        var component = this._components.get(componentId);
        if (component) {
            this._componentCtorMap.delete(component.constructor);
        }
        this._componentEntityMap.delete(componentId);
    };
    /**
     * Instantiates a component and associates it to the provided entity id
     * @param entityId Entity id to associate new component instance to.
     * @param componentCtor A component constructor that implements IComponent
     * @returns The new component id
     */
    EntityComponentManager.prototype.addComponent = function (entityId, componentCtor) {
        return __awaiter(this, void 0, void 0, function () {
            var component, componentId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._entities.has(entityId)) {
                            throw new entities_1.EntityDoesNotExist(entityId);
                        }
                        component = new componentCtor();
                        componentId = this._idGen();
                        this._components.set(componentId, component);
                        this.mapEntityComponent(entityId, componentId, componentCtor);
                        return [4 /*yield*/, this.broadcast(events_1.EVT_COMPONENT_ADDED, entityId, componentId, component)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, componentId];
                }
            });
        });
    };
    /**
     * Removes a component from the system and entity association
     * @param componentId The component id to remove
     */
    EntityComponentManager.prototype.removeComponent = function (componentId) {
        return __awaiter(this, void 0, void 0, function () {
            var component, entityId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        component = this._components.get(componentId);
                        if (!component) {
                            throw new components_1.ComponentDoesNotExist(componentId);
                        }
                        entityId = this._componentEntityMap.get(componentId);
                        if (!entityId) {
                            throw new entities_1.InvalidEntityAssociation();
                        }
                        // remove maps
                        this.unmapEntityComponent(entityId, componentId);
                        // finally remove component itself
                        this._components.delete(componentId);
                        return [4 /*yield*/, this.broadcast(events_1.EVT_COMPONENT_REMOVED, entityId, componentId, component)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return EntityComponentManager;
}(composer_1.Extension));
exports.EntityComponentManager = EntityComponentManager;
