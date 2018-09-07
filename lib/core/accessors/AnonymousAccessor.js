var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Accessor_1 = require("./Accessor");
var AnonymousAccessor = /** @class */ (function (_super) {
    __extends(AnonymousAccessor, _super);
    function AnonymousAccessor(buildSharedQuery) {
        var _this = _super.call(this) || this;
        if (buildSharedQuery) {
            _this.buildSharedQuery = buildSharedQuery;
        }
        return _this;
    }
    return AnonymousAccessor;
}(Accessor_1.Accessor));
exports.AnonymousAccessor = AnonymousAccessor;
//# sourceMappingURL=AnonymousAccessor.js.map