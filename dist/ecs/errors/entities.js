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
exports.InvalidEntityAssociation = exports.EntityDoesNotExist = void 0;
var EntityDoesNotExist = /** @class */ (function (_super) {
    __extends(EntityDoesNotExist, _super);
    function EntityDoesNotExist(entityID) {
        var _this = _super.call(this, "The entity \"" + entityID + "\" does not exist") || this;
        Object.setPrototypeOf(_this, EntityDoesNotExist.prototype);
        return _this;
    }
    return EntityDoesNotExist;
}(Error));
exports.EntityDoesNotExist = EntityDoesNotExist;
var InvalidEntityAssociation = /** @class */ (function (_super) {
    __extends(InvalidEntityAssociation, _super);
    function InvalidEntityAssociation() {
        var _this = _super.call(this, "Invalid Entity Association") || this;
        Object.setPrototypeOf(_this, InvalidEntityAssociation.prototype);
        return _this;
    }
    return InvalidEntityAssociation;
}(Error));
exports.InvalidEntityAssociation = InvalidEntityAssociation;
