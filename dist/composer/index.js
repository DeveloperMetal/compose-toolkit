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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compose = exports.Extension = exports.Controller = void 0;
var types_1 = require("./types");
var Controller = /** @class */ (function () {
    function Controller(extensions) {
        var e_1, _a;
        this._extensions = new Map();
        this._events = new Map();
        this._one = new Map();
        this._initialized = false;
        try {
            for (var extensions_1 = __values(extensions), extensions_1_1 = extensions_1.next(); !extensions_1_1.done; extensions_1_1 = extensions_1.next()) {
                var factory = extensions_1_1.value;
                if (typeof factory === "function") {
                    var extension = new factory(this);
                    this._extensions.set(factory, extension);
                }
                else {
                    var extension = new factory.extension(this);
                    this._extensions.set(factory.extension, extension);
                    Reflect.set(this, factory.as, extension);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (extensions_1_1 && !extensions_1_1.done && (_a = extensions_1.return)) _a.call(extensions_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    Object.defineProperty(Controller.prototype, "initialized", {
        get: function () {
            return this._initialized;
        },
        enumerable: false,
        configurable: true
    });
    Controller.prototype.getComponent = function (extension) {
        return this._extensions.get(extension);
    };
    Controller.prototype.broadcast = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var evMethod, _ev, promises, _a, _b, extension, member, e_2_1, _c, _d, listener, _one;
            var e_2, _e, e_3, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        evMethod = typeof event === "string" ? "on" + event[0].toUpperCase() + event.substr(1) : event;
                        _ev = this._events.get(event);
                        promises = [];
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 6, 7, 8]);
                        _a = __values(this._extensions.values()), _b = _a.next();
                        _g.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 5];
                        extension = _b.value;
                        member = Reflect.get(extension, evMethod);
                        if (!(typeof member === "function")) return [3 /*break*/, 4];
                        return [4 /*yield*/, Promise.resolve(Reflect.apply(member, extension, args))];
                    case 3:
                        _g.sent();
                        _g.label = 4;
                    case 4:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_2_1 = _g.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        if (!(event != types_1.EVT_BROADCAST)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.broadcast.apply(this, __spreadArray([types_1.EVT_BROADCAST, event], __read(args), false))];
                    case 9:
                        _g.sent();
                        _g.label = 10;
                    case 10:
                        if (_ev) {
                            try {
                                for (_c = __values(_ev.values()), _d = _c.next(); !_d.done; _d = _c.next()) {
                                    listener = _d.value;
                                    _one = this._one.get(event);
                                    if (_one && _one.has(listener)) {
                                        this.off(event, listener);
                                    }
                                    promises.push(Promise.resolve(listener.apply(void 0, __spreadArray([this], __read(args), false))));
                                }
                            }
                            catch (e_3_1) { e_3 = { error: e_3_1 }; }
                            finally {
                                try {
                                    if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                                }
                                finally { if (e_3) throw e_3.error; }
                            }
                        }
                        return [4 /*yield*/, Promise.allSettled(promises)];
                    case 11:
                        _g.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype.on = function (event, callback) {
        var _ev = this._events.get(event);
        if (!_ev) {
            _ev = new Set();
            this._events.set(event, _ev);
        }
        _ev.add(callback);
        return this;
    };
    Controller.prototype.off = function (event, callback) {
        var _ev = this._events.get(event);
        if (!_ev) {
            return this;
        }
        _ev.delete(callback);
        var _one = this._one.get(event);
        if (!_one) {
            return this;
        }
        _one.delete(callback);
        return this;
    };
    Controller.prototype.once = function (event, callback) {
        this.on(event, callback);
        var _one = this._one.get(event);
        if (!_one) {
            _one = new Set();
            this._one.set(event, _one);
        }
        _one.add(callback);
        return this;
    };
    Controller.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.broadcast(types_1.EVT_BEFORE_INIT)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.broadcast(types_1.EVT_INIT)];
                    case 2:
                        _a.sent();
                        this._initialized = true;
                        return [4 /*yield*/, this.broadcast(types_1.EVT_AFTER_INIT)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Controller;
}());
exports.Controller = Controller;
var Extension = /** @class */ (function () {
    function Extension(controller) {
        this.controller = controller;
    }
    Extension.prototype.broadcast = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                return [2 /*return*/, (_a = this.controller).broadcast.apply(_a, __spreadArray([event], __read(args), false))];
            });
        });
    };
    return Extension;
}());
exports.Extension = Extension;
function Compose() {
    var extensions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        extensions[_i] = arguments[_i];
    }
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super.call(this, extensions) || this;
        }
        return class_1;
    }(Controller));
}
exports.Compose = Compose;
