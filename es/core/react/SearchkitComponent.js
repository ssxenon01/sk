import * as React from "react";
import * as PropTypes from "prop-types";
import { SearchkitManager } from "../SearchkitManager";
import { Utils } from "../support";
const mapValues = require("lodash/mapValues");
import { block } from "./block";
export class SearchkitComponent extends React.Component {
    constructor(props) {
        super(props);
        this.translations = {};
        this.unmounted = false;
        this.translate = this.translate.bind(this);
    }
    defineBEMBlocks() {
        return null;
    }
    defineAccessor() {
        return null;
    }
    translate(key, interpolations) {
        let translation = ((this.searchkit.translate(key)) ||
            (this.props.translations && this.props.translations[key]) ||
            this.translations[key] || key);
        return Utils.translate(translation, interpolations);
    }
    get bemBlocks() {
        return mapValues(this.defineBEMBlocks(), (cssClass) => {
            return block(cssClass).el;
        });
    }
    _getSearchkit() {
        return this.props.searchkit || this.context["searchkit"];
    }
    componentWillMount() {
        this.searchkit = this._getSearchkit();
        if (this.searchkit) {
            this.accessor = this.defineAccessor();
            if (this.accessor) {
                this.accessor = this.searchkit.addAccessor(this.accessor);
            }
            this.stateListenerUnsubscribe = this.searchkit.emitter.addListener(() => {
                if (!this.unmounted) {
                    this.forceUpdate();
                }
            });
        }
        else {
            console.warn("No searchkit found in props or context for " + this.constructor["name"]);
        }
    }
    componentWillUnmount() {
        if (this.stateListenerUnsubscribe) {
            this.stateListenerUnsubscribe();
        }
        if (this.searchkit && this.accessor) {
            this.searchkit.removeAccessor(this.accessor);
        }
        this.unmounted = true;
    }
    getResults() {
        return this.searchkit.results;
    }
    getHits() {
        return this.searchkit.getHits();
    }
    getHitsCount() {
        return this.searchkit.getHitsCount();
    }
    hasHits() {
        return this.searchkit.hasHits();
    }
    hasHitsChanged() {
        return this.searchkit.hasHitsChanged();
    }
    getQuery() {
        return this.searchkit.query;
    }
    isInitialLoading() {
        return this.searchkit.initialLoading;
    }
    isLoading() {
        return this.searchkit.loading;
    }
    getError() {
        return this.searchkit.error;
    }
}
SearchkitComponent.contextTypes = {
    searchkit: PropTypes.instanceOf(SearchkitManager)
};
SearchkitComponent.translationsPropType = (translations) => {
    return PropTypes.shape(mapValues(translations, () => PropTypes.string));
};
SearchkitComponent.propTypes = {
    mod: PropTypes.string,
    className: PropTypes.string,
    translations: PropTypes.objectOf(PropTypes.string),
    searchkit: PropTypes.instanceOf(SearchkitManager)
};
//# sourceMappingURL=SearchkitComponent.js.map