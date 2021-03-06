import * as React from "react";
import { mount } from "enzyme";
import { ViewSwitcherToggle } from "./ViewSwitcherToggle";
import { ViewSwitcherHits } from "./ViewSwitcherHits";
import { ViewSwitcherConfig } from "./ViewSwitcherConfig";
import { Select } from "../../ui";
import { SearchkitManager } from "../../../core";
import { fastClick } from "../../__test__/TestHelpers";
const map = require("lodash/map");
const MovieHitsGridItem = (props) => {
    return (React.createElement("div", { className: "grid-item" }, props.result.title));
};
const MovieHitsListItem = (props) => {
    return (React.createElement("div", { className: "list-item" }, props.result.title));
};
const MovieList = (props) => {
    return (React.createElement("div", { className: "custom-list" }, map(props.hits, "_id").join(",")));
};
describe("View Switcher Hits component", () => {
    describe('renders correctly', () => {
        beforeEach(() => {
            this.searchkit = SearchkitManager.mock();
            this.searchkit.setResults({
                hits: {
                    hits: [{ _id: 1, title: 1 }, { _id: 2, title: 2 }],
                    total: 2
                }
            });
            this.setWrapper = (props = {}) => {
                this.wrapper = mount(React.createElement("div", null,
                    React.createElement(ViewSwitcherHits, { searchkit: this.searchkit, hitComponents: [
                            { key: "grid", title: "Grid", itemComponent: MovieHitsGridItem, defaultOption: true },
                            { key: "list", title: "List", itemComponent: MovieHitsListItem },
                            { key: "custom-list", title: "Custom List", listComponent: MovieList }
                        ], highlightFields: ["title"], hitsPerPage: 12, sourceFilter: ["title"] }),
                    React.createElement(ViewSwitcherToggle, Object.assign({ searchkit: this.searchkit, translations: { "Grid": "My Grid" } }, props))));
            };
            this.ViewOptionsAccessor = this.searchkit.accessors.accessors[0];
        });
        it("View Switcher Hits", () => {
            this.setWrapper();
            expect(this.wrapper).toMatchSnapshot();
            fastClick(this.wrapper.find(".sk-toggle-option").at(1));
            this.wrapper.update();
            expect(this.wrapper).toMatchSnapshot();
            fastClick(this.wrapper.find(".sk-toggle-option").at(2));
            expect(this.wrapper).toMatchSnapshot();
        });
        it("custom mod, className, listComponent", () => {
            this.setWrapper({
                mod: "my-view-switcher", className: "customClass",
                listComponent: Select
            });
            expect(this.wrapper).toMatchSnapshot();
        });
        it("Works with ViewSwitcherConfig", () => {
            this.wrapper = mount(React.createElement("div", null,
                React.createElement(ViewSwitcherConfig, { searchkit: this.searchkit, hitComponents: [
                        { key: "grid", title: "Grid", itemComponent: MovieHitsGridItem, defaultOption: true },
                        { key: "list", title: "List", itemComponent: MovieHitsListItem },
                        { key: "custom-list", title: "Custom List", listComponent: MovieList }
                    ] }),
                React.createElement(ViewSwitcherHits, { searchkit: this.searchkit, highlightFields: ["title"], hitsPerPage: 12, sourceFilter: ["title"] }),
                React.createElement(ViewSwitcherToggle, { searchkit: this.searchkit, translations: { "Grid": "My Grid" } })));
            expect(this.wrapper).toMatchSnapshot();
            fastClick(this.wrapper.find("div[data-key='list']"));
            expect(this.wrapper.find("div[data-key='list']").hasClass("is-active")).toBe(true);
            expect(this.wrapper).toMatchSnapshot();
        });
        it("renders null when no accessor available", () => {
            this.wrapper = mount(React.createElement("div", null,
                React.createElement(ViewSwitcherToggle, { searchkit: this.searchkit, translations: { "Grid": "My Grid" } })));
            expect(this.wrapper).toMatchSnapshot();
        });
    });
});
//# sourceMappingURL=ViewSwitcherHits.unit.js.map