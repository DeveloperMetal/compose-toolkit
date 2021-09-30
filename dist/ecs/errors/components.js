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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentDoesNotExist = void 0;
var ComponentDoesNotExist = /** @class */ (function (_super) {
    __extends(ComponentDoesNotExist, _super);
    function ComponentDoesNotExist(componentId) {
        var _this = _super.call(this) || this;
        _this.message = "Component \"" + componentId + " does not exist";
        Object.setPrototypeOf(_this, ComponentDoesNotExist.prototype);
        return _this;
    }
    return ComponentDoesNotExist;
}(Error));
exports.ComponentDoesNotExist = ComponentDoesNotExist;
