import { LevelState } from "../state";
import { FilterBasedAccessor } from "./FilterBasedAccessor";
import { TermQuery, TermsBucket, FilterBucket, BoolMust, NestedQuery, NestedBucket, MinMetric, DefaultNumberBuckets } from "../query";
const map = require("lodash/map");
const get = require("lodash/get");
const includes = require("lodash/includes");
const startsWith = require("lodash/startsWith");
const each = require("lodash/each");
const take = require("lodash/take");
export class NestedFacetAccessor extends FilterBasedAccessor {
    constructor(key, options) {
        super(key, options.id);
        this.state = new LevelState();
        this.options = options;
    }
    onResetFilters() {
        this.resetState();
    }
    getBuckets(level) {
        let buckets = this.getAggregations([this.key, "children", "lvl" + level, "children", "buckets"], []);
        return map(buckets, (item) => {
            item.key = String(item.key);
            return item;
        });
    }
    buildSharedQuery(query) {
        let levelFilters = this.state.getValue();
        let lastIndex = levelFilters.length - 1;
        var filterTerms = map(levelFilters, (filter, i) => {
            let value = filter[0];
            let isLeaf = i === lastIndex;
            let subField = isLeaf ? ".value" : ".ancestors";
            return TermQuery(this.options.field + subField, value);
        });
        if (filterTerms.length > 0) {
            let leafFilter = get(levelFilters, [levelFilters.length - 1, 0], "");
            let parentOfleaf = get(levelFilters, [levelFilters.length - 2, 0], this.options.title || this.key);
            let selectedFilter = {
                id: this.key,
                name: this.translate(parentOfleaf),
                value: leafFilter,
                remove: () => {
                    this.state = this.state.clear(levelFilters.length - 1);
                }
            };
            query = query.addFilter(this.uuid, NestedQuery(this.options.field, BoolMust(filterTerms))).addSelectedFilter(selectedFilter);
        }
        return query;
    }
    getTermAggs() {
        let subAggs = undefined;
        let orderMetric = undefined;
        if (this.options.orderKey) {
            let orderDirection = this.options.orderDirection || "asc";
            let orderKey = this.options.orderKey;
            if (includes(["_count", "_term"], orderKey)) {
                orderMetric = { [orderKey]: orderDirection };
            }
            else {
                if (startsWith(orderKey, this.options.field + ".")) {
                    const subAggName = this.options.field + "_order";
                    orderMetric = {
                        [subAggName]: orderDirection
                    };
                    subAggs = MinMetric(subAggName, orderKey);
                }
            }
        }
        let valueField = this.options.field + ".value";
        let nBuckets = this.options.size || DefaultNumberBuckets;
        return TermsBucket("children", valueField, { size: nBuckets, order: orderMetric }, subAggs);
    }
    buildOwnQuery(query) {
        let levelField = this.options.field + ".level";
        let ancestorsField = this.options.field + ".ancestors";
        let startLevel = this.options.startLevel || 1;
        let termAggs = this.getTermAggs();
        let lvlAggs = [];
        var addLevel = (level, ancestors = []) => {
            lvlAggs.push(FilterBucket("lvl" + level, BoolMust([TermQuery(levelField, level + startLevel), ...ancestors]), termAggs));
        };
        addLevel(0);
        let levels = this.state.getValue();
        each(levels, (_level, i) => {
            let ancestors = map(take(levels, i + 1), (level) => {
                return TermQuery(ancestorsField, level[0]);
            });
            addLevel(i + 1, ancestors);
        });
        return query.setAggs(FilterBucket(this.key, query.getFiltersWithoutKeys(this.uuid), NestedBucket("children", this.options.field, ...lvlAggs)));
    }
}
//# sourceMappingURL=NestedFacetAccessor.js.map