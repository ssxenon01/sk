Object.defineProperty(exports, "__esModule", { value: true });
var assign = require("lodash/assign");
function MatchQuery(field, query, options) {
    if (options === void 0) { options = {}; }
    var _a;
    if (!query || !field) {
        return;
    }
    return {
        match: (_a = {},
            _a[field] = assign({ query: query }, options),
            _a)
    };
}
exports.MatchQuery = MatchQuery;
//# sourceMappingURL=MatchQuery.js.map