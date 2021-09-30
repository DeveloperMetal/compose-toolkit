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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineManager = void 0;
var composer_1 = require("../../composer");
var events_1 = require("../events");
var entityComponentManager_1 = require("./entityComponentManager");
var PipelineManager = /** @class */ (function (_super) {
    __extends(PipelineManager, _super);
    function PipelineManager(controller) {
        var _this = _super.call(this, controller) || this;
        _this._pipeline = new Map();
        _this.entityManager = _this.controller.getComponent(entityComponentManager_1.EntityComponentManager);
        return _this;
    }
    /**
     *
     * @param component
     * @param pipeline The pipeline to enqueue a component onto.
     */
    PipelineManager.prototype.enqueue = function (component, pipeline) {
        if (pipeline === void 0) { pipeline = "default"; }
        // create pipeline if one doesn't exist
        if (!this._pipeline.has(pipeline)) {
            this._pipeline.set(pipeline, new Map());
        }
        var componentInstance = typeof component === "object" ? component : this.entityManager.getComponentById(component);
        var componentCtor = componentInstance.constructor;
        var pipelineCompMap = this._pipeline.get(pipeline);
        if (!pipelineCompMap.has(componentCtor)) {
            pipelineCompMap.set(componentCtor, new Set());
        }
        var pipelineQueue = pipelineCompMap.get(componentCtor);
        pipelineQueue.add(componentInstance);
    };
    PipelineManager.prototype.execute = function (pipeline) {
        if (pipeline === void 0) { pipeline = "default"; }
        return __awaiter(this, void 0, void 0, function () {
            var queue, _a, _b, _c, pipelineName, queueMap, _d, _e, _f, Ctor, queue_1, e_1_1, e_2_1;
            var e_2, _g, e_1, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        queue = this._pipeline.get(pipeline);
                        if (!queue) return [3 /*break*/, 14];
                        _j.label = 1;
                    case 1:
                        _j.trys.push([1, 12, 13, 14]);
                        _a = __values(this._pipeline.entries()), _b = _a.next();
                        _j.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 11];
                        _c = __read(_b.value, 2), pipelineName = _c[0], queueMap = _c[1];
                        _j.label = 3;
                    case 3:
                        _j.trys.push([3, 8, 9, 10]);
                        _d = (e_1 = void 0, __values(queueMap.entries())), _e = _d.next();
                        _j.label = 4;
                    case 4:
                        if (!!_e.done) return [3 /*break*/, 7];
                        _f = __read(_e.value, 2), Ctor = _f[0], queue_1 = _f[1];
                        if (!(queue_1.size > 0)) return [3 /*break*/, 6];
                        // TODO: Due to posibility of components entering the queue while a system runs
                        // We need assign a new queu instance. 
                        //
                        // There is a chance here to optimize by not creating new
                        // sets on every call to execute. We could probably swap sets between calls
                        // and empty them instead of new Set(). Need to test performance between clear and new.
                        queueMap.set(Ctor, new Set());
                        return [4 /*yield*/, this.broadcast(events_1.EVT_EXEC_PIPELINE, pipelineName, queue_1)];
                    case 5:
                        _j.sent();
                        _j.label = 6;
                    case 6:
                        _e = _d.next();
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_1_1 = _j.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (_e && !_e.done && (_h = _d.return)) _h.call(_d);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 10:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 11: return [3 /*break*/, 14];
                    case 12:
                        e_2_1 = _j.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 14];
                    case 13:
                        try {
                            if (_b && !_b.done && (_g = _a.return)) _g.call(_a);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    return PipelineManager;
}(composer_1.Extension));
exports.PipelineManager = PipelineManager;
