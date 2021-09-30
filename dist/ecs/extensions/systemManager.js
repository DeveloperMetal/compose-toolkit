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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemMananger = void 0;
var composer_1 = require("../../composer");
var events_1 = require("../events");
/**
 * Manages systems execution
 */
var SystemMananger = /** @class */ (function (_super) {
    __extends(SystemMananger, _super);
    function SystemMananger(controller) {
        var _this = _super.call(this, controller) || this;
        _this._systems = new Map();
        _this._systemEntry = new Map();
        return _this;
    }
    /**
     * Adds a system definition to manage execute
     * @param system The system to register
     */
    SystemMananger.prototype.addSystem = function (system) {
        if (!this._systems.has(system.component)) {
            this._systems.set(system.component, new Set());
        }
        var systemSet = this._systems.get(system.component);
        systemSet.add(system);
        this._systemEntry.set(system.name, system);
    };
    /**
     * Removes a system
     * @param name A system to remove by its name
     */
    SystemMananger.prototype.removeSystem = function (name) {
        var system = this._systemEntry.get(name);
        if (system) {
            var systemSet = this._systems.get(system.component);
            systemSet.delete(system);
            this._systemEntry.delete(name);
            if (systemSet.size == 0) {
                this._systems.delete(system.component);
            }
        }
    };
    /**
     * Returns true if a system was defined with the provided name.
     * @param name THe system's name to check.
     * @returns True if the system exists.
     */
    SystemMananger.prototype.exists = function (name) {
        return this._systemEntry.has(name);
    };
    /**
     * Event handler to execute systems when specific pipelines are scheduled to run.
     * @param pipeline The pipeline running
     * @param componentCtor The component constructor
     * @param queue A queue of component instances
     */
    SystemMananger.prototype[events_1.EVT_EXEC_PIPELINE] = function (pipeline, componentCtor, queue) {
        return __awaiter(this, void 0, void 0, function () {
            var promises, systemSet, _a, _b, system, runCount, _c, _d, component, runSystem, e_1_1;
            var e_1, _e, e_2, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        promises = [];
                        systemSet = this._systems.get(componentCtor);
                        if (!systemSet) {
                            return [2 /*return*/, false];
                        }
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 6, 7, 8]);
                        _a = __values(systemSet.values()), _b = _a.next();
                        _g.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 5];
                        system = _b.value;
                        if (system.begin) {
                            system.begin(pipeline, queue.size);
                        }
                        runCount = 0;
                        try {
                            for (_c = (e_2 = void 0, __values(queue.values())), _d = _c.next(); !_d.done; _d = _c.next()) {
                                component = _d.value;
                                runSystem = system.filter ? system.filter(component) : true;
                                if (runSystem) {
                                    promises.push(Promise.resolve(system.exec(component)));
                                    runCount++;
                                }
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        return [4 /*yield*/, Promise.allSettled(promises)];
                    case 3:
                        _g.sent();
                        if (system.end) {
                            system.end(pipeline, runCount);
                        }
                        _g.label = 4;
                    case 4:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_1_1 = _g.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/, true];
                }
            });
        });
    };
    return SystemMananger;
}(composer_1.Extension));
exports.SystemMananger = SystemMananger;
