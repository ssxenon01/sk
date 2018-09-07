import * as PropTypes from "prop-types";
import { SearchkitComponent, PageSizeAccessor, RenderComponentPropType, renderComponent } from "../../../core";
const map = require("lodash/map");
const defaults = require("lodash/defaults");
import { Select } from "../../ui";
export class PageSizeSelector extends SearchkitComponent {
    getPageSizeAccessor() {
        return this.searchkit.getAccessorByType(PageSizeAccessor);
    }
    setSize(size) {
        let pageSizeAccessor = this.getPageSizeAccessor();
        if (size) {
            pageSizeAccessor.setSize(Number(size));
            this.searchkit.performSearch();
        }
    }
    setItems(sizes) {
        this.setSize(sizes[0]);
    }
    render() {
        let pageSizeAccessor = this.getPageSizeAccessor();
        if (pageSizeAccessor) {
            let options = map(this.props.options, (option) => {
                return { key: option, label: option };
            });
            let selectedSize = pageSizeAccessor.getSize();
            const { mod, className } = this.props;
            return renderComponent(this.props.listComponent, {
                mod, className,
                disabled: !this.hasHits(),
                items: options,
                selectedItems: [selectedSize],
                toggleItem: this.setSize.bind(this),
                setItems: this.setItems.bind(this),
                urlBuilder: (_item) => { },
                translate: this.translate
            });
        }
        return null;
    }
}
PageSizeSelector.defaultProps = {
    listComponent: Select
};
PageSizeSelector.propTypes = defaults({
    listComponent: RenderComponentPropType,
    options: PropTypes.arrayOf(PropTypes.number).isRequired
}, SearchkitComponent.propTypes);
//# sourceMappingURL=PageSizeSelector.js.map