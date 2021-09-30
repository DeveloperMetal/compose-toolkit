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
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
var types_1 = require("./types");
var Extension1 = /** @class */ (function (_super) {
    __extends(Extension1, _super);
    function Extension1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Extension1;
}(_1.Extension));
var Extension2 = /** @class */ (function (_super) {
    __extends(Extension2, _super);
    function Extension2() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Extension2;
}(_1.Extension));
describe("Define controller", function () {
    it("Compose", function () {
        var Ctor = (0, _1.Compose)(Extension1, Extension2);
        var ctrl = new Ctor();
        var returnedExt1 = ctrl.getComponent(Extension1);
        var returnedExt2 = ctrl.getComponent(Extension2);
        expect(returnedExt1).toBeTruthy();
        expect(returnedExt2).toBeTruthy();
        if (returnedExt1) {
            expect(returnedExt1.constructor).toBe(Extension1);
        }
        if (returnedExt2) {
            expect(returnedExt2.constructor).toBe(Extension2);
        }
    });
    it("Compose with named extensions", function () {
        var Ctor = (0, _1.Compose)({ extension: Extension1, as: "extension1" }, { extension: Extension2, as: "extension2" });
        var ctrl = new Ctor();
        expect(Reflect.has(ctrl, "extension1")).toBeTrue();
        expect(Reflect.has(ctrl, "extension2")).toBeTrue();
        expect(Reflect.get(ctrl, "extension1")).toBe(ctrl.getComponent(Extension1));
        expect(Reflect.get(ctrl, "extension2")).toBe(ctrl.getComponent(Extension2));
    });
    it("initialized", function () { return __awaiter(void 0, void 0, void 0, function () {
        var Ctor, ctrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Ctor = (0, _1.Compose)(Extension1, Extension2);
                    ctrl = new Ctor();
                    expect(ctrl.initialized).toBeFalsy();
                    return [4 /*yield*/, ctrl.init()];
                case 1:
                    _a.sent();
                    expect(ctrl.initialized).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("Events", function () {
    it("Broadcast", function () { return __awaiter(void 0, void 0, void 0, function () {
        var Ctor, ctrl, returnedExt1, returnedExt2, ext1BeforeInitMock, ext1InitMock, ext1AfterInit, ext2BeforeInitMock, ext2InitMock, ext2AfterInit;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Ctor = (0, _1.Compose)(Extension1, Extension2);
                    ctrl = new Ctor();
                    returnedExt1 = ctrl.getComponent(Extension1);
                    returnedExt2 = ctrl.getComponent(Extension2);
                    ext1BeforeInitMock = jest.fn();
                    ext1InitMock = jest.fn();
                    ext1AfterInit = jest.fn();
                    ext2BeforeInitMock = jest.fn();
                    ext2InitMock = jest.fn();
                    ext2AfterInit = jest.fn();
                    if (returnedExt1) {
                        Reflect.set(returnedExt1, types_1.EVT_BEFORE_INIT, ext1BeforeInitMock);
                        Reflect.set(returnedExt1, types_1.EVT_INIT, ext1InitMock);
                        Reflect.set(returnedExt1, types_1.EVT_AFTER_INIT, ext1AfterInit);
                    }
                    if (returnedExt2) {
                        Reflect.set(returnedExt2, types_1.EVT_BEFORE_INIT, ext2BeforeInitMock);
                        Reflect.set(returnedExt2, types_1.EVT_INIT, ext2InitMock);
                        Reflect.set(returnedExt2, types_1.EVT_AFTER_INIT, ext2AfterInit);
                    }
                    return [4 /*yield*/, ctrl.init()];
                case 1:
                    _a.sent();
                    expect(ext1BeforeInitMock).toHaveBeenCalledTimes(1);
                    expect(ext1InitMock).toHaveBeenCalledTimes(1);
                    expect(ext1AfterInit).toHaveBeenCalledTimes(1);
                    expect(ext2BeforeInitMock).toHaveBeenCalledTimes(1);
                    expect(ext2InitMock).toHaveBeenCalledTimes(1);
                    expect(ext2AfterInit).toHaveBeenCalledTimes(1);
                    expect(ext1BeforeInitMock).toHaveBeenCalledBefore(ext1InitMock);
                    expect(ext1InitMock).toHaveBeenCalledBefore(ext1AfterInit);
                    expect(ext1AfterInit).toHaveBeenCalledAfter(ext1BeforeInitMock);
                    expect(ext2BeforeInitMock).toHaveBeenCalledBefore(ext2InitMock);
                    expect(ext2InitMock).toHaveBeenCalledBefore(ext2AfterInit);
                    expect(ext2AfterInit).toHaveBeenCalledAfter(ext2BeforeInitMock);
                    expect(ext1BeforeInitMock).toHaveBeenCalledBefore(ext2BeforeInitMock);
                    expect(ext1InitMock).toHaveBeenCalledBefore(ext2InitMock);
                    expect(ext1AfterInit).toHaveBeenCalledBefore(ext2AfterInit);
                    return [2 /*return*/];
            }
        });
    }); });
    it("add/remove event listener", function () { return __awaiter(void 0, void 0, void 0, function () {
        var Ctor, ctrl, testMock, testMock2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Ctor = (0, _1.Compose)(Extension1, Extension2);
                    ctrl = new Ctor();
                    testMock = jest.fn();
                    testMock2 = jest.fn();
                    ctrl.on("test", testMock);
                    ctrl.on("test", testMock2);
                    return [4 /*yield*/, ctrl.broadcast("test", 1, 2, 3)];
                case 1:
                    _a.sent();
                    expect(testMock).toHaveBeenCalledTimes(1);
                    expect(testMock).toHaveBeenCalledWith(ctrl, 1, 2, 3);
                    expect(testMock2).toHaveBeenCalledTimes(1);
                    expect(testMock2).toHaveBeenCalledWith(ctrl, 1, 2, 3);
                    ctrl.off("test", testMock);
                    return [4 /*yield*/, ctrl.broadcast("test", 4, 5, 6)];
                case 2:
                    _a.sent();
                    expect(testMock).toHaveBeenCalledTimes(1);
                    expect(testMock2).toHaveBeenCalledTimes(2);
                    expect(testMock2).toHaveBeenCalledWith(ctrl, 4, 5, 6);
                    return [2 /*return*/];
            }
        });
    }); });
    it("event forwarding", function () { return __awaiter(void 0, void 0, void 0, function () {
        var Ctor, ctrl, ext1, testMock;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Ctor = (0, _1.Compose)(Extension1, Extension2);
                    ctrl = new Ctor();
                    ext1 = ctrl.getComponent(Extension1);
                    testMock = jest.fn();
                    if (ext1) {
                        Reflect.set(ext1, types_1.EVT_BROADCAST, testMock);
                    }
                    return [4 /*yield*/, ctrl.broadcast("test")];
                case 1:
                    _a.sent();
                    expect(testMock).toHaveBeenCalledTimes(1);
                    expect(testMock).toHaveBeenCalledWith("test");
                    return [2 /*return*/];
            }
        });
    }); });
    it("once event", function () { return __awaiter(void 0, void 0, void 0, function () {
        var Ctor, ctrl, testCallback, testCallback2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Ctor = (0, _1.Compose)(Extension1, Extension2);
                    ctrl = new Ctor();
                    testCallback = jest.fn();
                    testCallback2 = jest.fn();
                    ctrl.once("test", testCallback);
                    ctrl.once("test", testCallback2);
                    return [4 /*yield*/, ctrl.broadcast("test")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, ctrl.broadcast("test")];
                case 2:
                    _a.sent();
                    expect(testCallback).toHaveBeenCalledTimes(1);
                    expect(testCallback2).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it("remove non existent listener", function () {
        var Ctor = (0, _1.Compose)(Extension1, Extension2);
        var ctrl = new Ctor();
        expect(ctrl.off("no event", function () { })).toBe(ctrl);
    });
    it("extension broadcast", function () { return __awaiter(void 0, void 0, void 0, function () {
        var Ctor, ctrl, mockBroadcast, ext1, broadcast;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Ctor = (0, _1.Compose)(Extension1, Extension2);
                    ctrl = new Ctor();
                    mockBroadcast = jest.fn();
                    Reflect.set(ctrl, "broadcast", mockBroadcast);
                    ext1 = ctrl.getComponent(Extension1);
                    if (!ext1) return [3 /*break*/, 2];
                    broadcast = Reflect.get(ext1, "broadcast");
                    return [4 /*yield*/, Reflect.apply(broadcast, ext1, ["test", 1, 2, 3])];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    expect(mockBroadcast).toHaveBeenCalledTimes(1);
                    expect(mockBroadcast).toHaveBeenCalledWith("test", 1, 2, 3);
                    return [2 /*return*/];
            }
        });
    }); });
});
