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
var systemManager_1 = require("./systemManager");
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
describe("System Manager", function () {
    it("Add/remove system", function () { return __awaiter(void 0, void 0, void 0, function () {
        var world, systems, testSystem, testSystem2;
        return __generator(this, function (_a) {
            world = makeDummyWorld();
            systems = new systemManager_1.SystemMananger(world);
            testSystem = {
                name: "test1",
                pipeline: "default",
                component: TestComponent,
                filter: jest.fn(function () { return true; }),
                exec: jest.fn(),
                begin: jest.fn(),
                end: jest.fn()
            };
            testSystem2 = {
                name: "test2",
                pipeline: "default",
                component: TestComponent,
                filter: jest.fn(function () { return true; }),
                exec: jest.fn(),
                begin: jest.fn(),
                end: jest.fn()
            };
            systems.addSystem(testSystem);
            systems.addSystem(testSystem2);
            expect(systems.exists("test1")).toBeTrue();
            expect(systems.exists("test2")).toBeTrue();
            systems.removeSystem("test1");
            expect(systems.exists("test1")).toBeFalse();
            expect(systems.exists("test2")).toBeTrue();
            systems.removeSystem("test2");
            expect(systems.exists("test1")).toBeFalse();
            expect(systems.exists("test2")).toBeFalse();
            systems.removeSystem("test1");
            expect(systems.exists("test1")).toBeFalse();
            return [2 /*return*/];
        });
    }); });
    it("Execute System Simple", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockComponent, world, systems, testSystem, testQueue, norun;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockComponent = new TestComponent();
                    world = makeDummyWorld();
                    systems = new systemManager_1.SystemMananger(world);
                    testSystem = {
                        name: "test",
                        pipeline: "default",
                        component: TestComponent,
                        exec: jest.fn()
                    };
                    systems.addSystem(testSystem);
                    testQueue = new Set();
                    testQueue.add(mockComponent);
                    return [4 /*yield*/, Reflect.apply(Reflect.get(systems, events_1.EVT_EXEC_PIPELINE), systems, ["default", TestComponent, testQueue])];
                case 1:
                    norun = _a.sent();
                    expect(testSystem.exec).toHaveBeenCalledTimes(1);
                    expect(testSystem.exec).toHaveBeenCalledWith(mockComponent);
                    expect(norun).toBeTrue();
                    return [2 /*return*/];
            }
        });
    }); });
    it("Execute System - no filter", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockComponent, world, systems, testSystem, testQueue, norun;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockComponent = new TestComponent();
                    world = makeDummyWorld();
                    systems = new systemManager_1.SystemMananger(world);
                    testSystem = {
                        name: "test",
                        pipeline: "default",
                        component: TestComponent,
                        filter: jest.fn(function () { return true; }),
                        exec: jest.fn(),
                        begin: jest.fn(),
                        end: jest.fn()
                    };
                    systems.addSystem(testSystem);
                    testQueue = new Set();
                    testQueue.add(mockComponent);
                    return [4 /*yield*/, Reflect.apply(Reflect.get(systems, events_1.EVT_EXEC_PIPELINE), systems, ["default", TestComponent, testQueue])];
                case 1:
                    norun = _a.sent();
                    expect(testSystem.begin).toHaveBeenCalledTimes(1);
                    expect(testSystem.begin).toHaveBeenCalledWith("default", 1);
                    expect(testSystem.exec).toHaveBeenCalledTimes(1);
                    expect(testSystem.exec).toHaveBeenCalledWith(mockComponent);
                    expect(testSystem.end).toHaveBeenCalledTimes(1);
                    expect(testSystem.end).toHaveBeenCalledWith("default", 1);
                    expect(norun).toBeTrue();
                    return [2 /*return*/];
            }
        });
    }); });
    it("Execute System", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockComponent, world, systems, testSystem, testQueue, norun;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockComponent = new TestComponent();
                    world = makeDummyWorld();
                    systems = new systemManager_1.SystemMananger(world);
                    testSystem = {
                        name: "test",
                        pipeline: "default",
                        component: TestComponent,
                        filter: jest.fn(function () { return true; }),
                        exec: jest.fn(),
                        begin: jest.fn(),
                        end: jest.fn()
                    };
                    systems.addSystem(testSystem);
                    testQueue = new Set();
                    testQueue.add(mockComponent);
                    return [4 /*yield*/, Reflect.apply(Reflect.get(systems, events_1.EVT_EXEC_PIPELINE), systems, ["default", TestComponent, testQueue])];
                case 1:
                    norun = _a.sent();
                    expect(testSystem.filter).toHaveBeenCalledTimes(testQueue.size);
                    expect(testSystem.filter).toHaveBeenCalledWith(mockComponent);
                    expect(testSystem.begin).toHaveBeenCalledTimes(1);
                    expect(testSystem.begin).toHaveBeenCalledWith("default", 1);
                    expect(testSystem.exec).toHaveBeenCalledTimes(1);
                    expect(testSystem.exec).toHaveBeenCalledWith(mockComponent);
                    expect(testSystem.end).toHaveBeenCalledTimes(1);
                    expect(testSystem.end).toHaveBeenCalledWith("default", 1);
                    expect(norun).toBeTrue();
                    return [2 /*return*/];
            }
        });
    }); });
    it("Execute System - fail filter", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockComponent, world, systems, testSystem, testQueue, norun;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockComponent = new TestComponent();
                    world = makeDummyWorld();
                    systems = new systemManager_1.SystemMananger(world);
                    testSystem = {
                        name: "test",
                        pipeline: "default",
                        component: TestComponent,
                        filter: jest.fn(function () { return false; }),
                        exec: jest.fn()
                    };
                    systems.addSystem(testSystem);
                    testQueue = new Set();
                    testQueue.add(mockComponent);
                    return [4 /*yield*/, Reflect.apply(Reflect.get(systems, events_1.EVT_EXEC_PIPELINE), systems, ["default", TestComponent, testQueue])];
                case 1:
                    norun = _a.sent();
                    expect(testSystem.filter).toHaveBeenCalledTimes(testQueue.size);
                    expect(testSystem.filter).toHaveBeenCalledWith(mockComponent);
                    expect(testSystem.exec).toHaveBeenCalledTimes(0);
                    expect(norun).toBeTrue();
                    return [2 /*return*/];
            }
        });
    }); });
    it("Skip non existent systems", function () { return __awaiter(void 0, void 0, void 0, function () {
        var world, systems, testQueue, norun;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = makeDummyWorld();
                    systems = new systemManager_1.SystemMananger(world);
                    testQueue = new Set();
                    return [4 /*yield*/, Reflect.apply(Reflect.get(systems, events_1.EVT_EXEC_PIPELINE), systems, ["default", TestComponent, testQueue])];
                case 1:
                    norun = _a.sent();
                    expect(norun).toBeFalse();
                    return [2 /*return*/];
            }
        });
    }); });
});
