const head = require("lodash/head");
const find = require("lodash/find");
import { StatefulAccessor } from "./StatefulAccessor";
import { ValueState } from "../../core";
export class ViewOptionsAccessor extends StatefulAccessor {
    constructor(key, options) {
        super(key);
        this.state = new ValueState();
        this.options = options;
    }
    getSelectedOption() {
        return find(this.options, { key: this.state.getValue() }) ||
            find(this.options, { defaultOption: true }) ||
            head(this.options);
    }
    setView(key) {
        let view = find(this.options, { key });
        if (view) {
            if (view.defaultOption) {
                this.state = this.state.clear();
            }
            else {
                this.state = this.state.setValue(view.key);
            }
            this.search();
        }
    }
    search() {
        //this won't fire search as query didn't change, but it will serialize url
        //might need better way
        this.searchkit.performSearch(false, false);
        this.searchkit.emitter.trigger();
    }
}
//# sourceMappingURL=ViewOptionsAccessor.js.map