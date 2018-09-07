import * as PropTypes from "prop-types";
const defaults = require("lodash/defaults");
import { SearchkitComponent, ViewOptionsAccessor, RenderComponentPropType } from "../../../core";
export class ViewSwitcherConfig extends SearchkitComponent {
    defineAccessor() {
        return new ViewOptionsAccessor("view", this.props.hitComponents);
    }
    render() {
        return null;
    }
}
ViewSwitcherConfig.propTypes = defaults({
    hitComponents: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        itemComponent: RenderComponentPropType,
        listComponent: RenderComponentPropType,
        defaultOption: PropTypes.bool
    }))
}, SearchkitComponent.propTypes);
//# sourceMappingURL=ViewSwitcherConfig.js.map