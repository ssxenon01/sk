import { LevelState } from "../state";
import { FilterBasedAccessor } from "./FilterBasedAccessor";
import { TermQuery, TermsBucket, FilterBucket, BoolShould } from "../query/";
const map = require("lodash/map");
const each = require("lodash/each");
const compact = require("lodash/compact");
const take = require("lodash/take");
const omitBy = require("lodash/omitBy");
const isUndefined = require("lodash/isUndefined");
export class HierarchicalFacetAccessor extends FilterBasedAccessor {
    constructor(key, options) {
        super(key);
        this.state = new LevelState();
        this.options = options;
        this.computeUuids();
    }
    computeUuids() {
        this.uuids = map(this.options.fields, field => this.uuid + field);
    }
    onResetFilters() {
        this.resetState();
    }
    getBuckets(level) {
        let field = this.options.fields[level];
        let buckets = this.getAggregations([this.options.id, field, field, "buckets"], []);
        return map(buckets, (item) => {
            item.key = String(item.key);
            return item;
        });
    }
    getOrder() {
        if (this.options.orderKey) {
            let orderDirection = this.options.orderDirection || "asc";
            return { [this.options.orderKey]: orderDirection };
        }
    }
    buildSharedQuery(query) {
        each(this.options.fields, (field, i) => {
            var filters = this.state.getLevel(i);
            var parentFilter = this.state.getLevel(i - 1);
            var isLeaf = !this.state.levelHasFilters(i + 1);
            var filterTerms = map(filters, TermQuery.bind(null, field));
            if (filterTerms.length > 0) {
                query = query.addFilter(this.uuids[i], (filterTerms.length > 1) ?
                    BoolShould(filterTerms) : filterTerms[0]);
            }
            if (isLeaf) {
                var selectedFilters = map(filters, (filter) => {
                    return {
                        id: this.options.id,
                        name: this.translate(parentFilter[0]) || this.options.title || this.translate(field),
                        value: this.translate(filter),
                        remove: () => {
                            this.state = this.state.remove(i, filter);
                        }
                    };
                });
                query = query.addSelectedFilters(selectedFilters);
            }
        });
        return query;
    }
    buildOwnQuery(query) {
        let lvlAggs = compact(map(this.options.fields, (field, i) => {
            if (this.state.levelHasFilters(i - 1) || i == 0) {
                return FilterBucket(field, query.getFiltersWithKeys(take(this.uuids, i)), TermsBucket(field, field, omitBy({
                    size: this.options.size, order: this.getOrder()
                }, isUndefined)));
            }
        }));
        var aggs = FilterBucket(this.options.id, query.getFiltersWithoutKeys(this.uuids), ...lvlAggs);
        return query.setAggs(aggs);
    }
}
//# sourceMappingURL=HierarchicalFacetAccessor.js.map