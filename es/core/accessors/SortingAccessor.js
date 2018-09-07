import { ValueState } from "../state";
import { StatefulAccessor } from "./StatefulAccessor";
import { Utils } from "../support";
const find = require("lodash/find");
const head = require("lodash/head");
const map = require("lodash/map");
export class SortingAccessor extends StatefulAccessor {
    constructor(key, options) {
        super(key);
        this.state = new ValueState();
        this.options = options;
        this.options.options = Utils.computeOptionKeys(this.options.options, ["field", "order"], "none");
    }
    getSelectedOption() {
        let options = this.options.options;
        return find(options, { key: `${this.state.getValue()}` }) ||
            find(options, { defaultOption: true }) ||
            head(options);
    }
    getSortQuery(sortOption) {
        if (sortOption.fields) {
            return map(sortOption.fields, (field) => {
                return { [field.field]: field.options || {} };
            });
        }
        else if (sortOption.field && sortOption.order) {
            return [{ [sortOption.field]: sortOption.order }];
        }
        else if (sortOption.field) {
            return [sortOption.field];
        }
        return null;
    }
    buildOwnQuery(query) {
        let selectedSortOption = this.getSelectedOption();
        if (selectedSortOption) {
            let sortQuery = this.getSortQuery(selectedSortOption);
            if (sortQuery) {
                query = query.setSort(sortQuery);
            }
        }
        return query;
    }
}
//# sourceMappingURL=SortingAccessor.js.map