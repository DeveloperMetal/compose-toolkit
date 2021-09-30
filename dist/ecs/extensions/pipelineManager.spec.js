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
var events_1 = require("../events");
var pipelineManager_1 = require("./pipelineManager");
var makeDummyWorld = function (getComponent) {
    var dummy = new composer_1.Controller([]);
    dummy.broadcast = jest.fn();
    if (getComponent) {
        dummy.getComponent = jest.fn(getComponent);
    }
    else {
        dummy.getComponent = jest.fn();
    }
    return dummy;
};
var DummyComponent = /** @class */ (function () {
    function DummyComponent() {
    }
    return DummyComponent;
}());
describe("Pipelines", function () {
    it("Enqueue pipeline / object", function () {
        var _a, _b, _c;
        var world = makeDummyWorld();
        var pipelineMan = new pipelineManager_1.PipelineManager(world);
        var dummyComp = new DummyComponent();
        var _pipeline = Reflect.get(pipelineMan, "_pipeline");
        pipelineMan.enqueue(dummyComp);
        expect(_pipeline.has("default")).toBeTrue();
        expect((_a = _pipeline.get("default")) === null || _a === void 0 ? void 0 : _a.get(DummyComponent)).toBeTruthy();
        expect((_c = (_b = _pipeline.get("default")) === null || _b === void 0 ? void 0 : _b.get(DummyComponent)) === null || _c === void 0 ? void 0 : _c.has(dummyComp)).toBeTrue();
    });
    it("Enqueue pipeline / object non default", function () {
        var _a, _b, _c;
        var world = makeDummyWorld();
        var pipelineMan = new pipelineManager_1.PipelineManager(world);
        var dummyComp = new DummyComponent();
        var pipelineName = "test";
        var _pipeline = Reflect.get(pipelineMan, "_pipeline");
        pipelineMan.enqueue(dummyComp, pipelineName);
        expect(_pipeline.has(pipelineName)).toBeTrue();
        expect((_a = _pipeline.get(pipelineName)) === null || _a === void 0 ? void 0 : _a.get(DummyComponent)).toBeTruthy();
        expect((_c = (_b = _pipeline.get(pipelineName)) === null || _b === void 0 ? void 0 : _b.get(DummyComponent)) === null || _c === void 0 ? void 0 : _c.has(dummyComp)).toBeTrue();
    });
    it("Enqueue pipeline / id", function () {
        var _a, _b, _c;
        var world = makeDummyWorld();
        var pipelineMan = new pipelineManager_1.PipelineManager(world);
        var dummyComp = new DummyComponent();
        var _pipeline = Reflect.get(pipelineMan, "_pipeline");
        Reflect.defineProperty(pipelineMan, "entityManager", {
            writable: false,
            value: {
                getComponentById: jest.fn(function () { return dummyComp; })
            }
        });
        pipelineMan.enqueue("123");
        expect(_pipeline.has("default")).toBeTrue();
        expect((_a = _pipeline.get("default")) === null || _a === void 0 ? void 0 : _a.get(DummyComponent)).toBeTruthy();
        expect((_c = (_b = _pipeline.get("default")) === null || _b === void 0 ? void 0 : _b.get(DummyComponent)) === null || _c === void 0 ? void 0 : _c.has(dummyComp)).toBeTrue();
    });
    it("Execute pipeline", function () { return __awaiter(void 0, void 0, void 0, function () {
        var world, pipelineMan, dummyComp, dummyComp2, broadcastMock, pipelineName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = makeDummyWorld();
                    pipelineMan = new pipelineManager_1.PipelineManager(world);
                    dummyComp = new DummyComponent();
                    dummyComp2 = new DummyComponent();
                    broadcastMock = jest.fn();
                    pipelineName = "default";
                    Reflect.set(pipelineMan, "broadcast", broadcastMock);
                    pipelineMan.enqueue(dummyComp);
                    pipelineMan.enqueue(dummyComp2);
                    return [4 /*yield*/, expect(pipelineMan.execute()).toResolve()];
                case 1:
                    _a.sent();
                    expect(broadcastMock).toHaveBeenCalledWith(events_1.EVT_EXEC_PIPELINE, pipelineName, new Set([dummyComp, dummyComp2]));
                    // a second call should not trigger anythign since queue is empty now
                    return [4 /*yield*/, expect(pipelineMan.execute()).toResolve()];
                case 2:
                    // a second call should not trigger anythign since queue is empty now
                    _a.sent();
                    expect(broadcastMock).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it("No execute nonexistent pipeline", function () { return __awaiter(void 0, void 0, void 0, function () {
        var world, pipelineMan, broadcastMock, pipelineName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = makeDummyWorld();
                    pipelineMan = new pipelineManager_1.PipelineManager(world);
                    broadcastMock = jest.fn();
                    pipelineName = "non-existent";
                    Reflect.set(pipelineMan, "broadcast", broadcastMock);
                    return [4 /*yield*/, expect(pipelineMan.execute(pipelineName)).toResolve()];
                case 1:
                    _a.sent();
                    expect(broadcastMock).toHaveBeenCalledTimes(0);
                    return [2 /*return*/];
            }
        });
    }); });
});
