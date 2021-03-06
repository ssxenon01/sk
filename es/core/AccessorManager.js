import { StatefulAccessor, BaseQueryAccessor, noopQueryAccessor } from "./accessors";
import { Utils } from "./support";
import { ImmutableQuery } from "./query";
const filter = require("lodash/filter");
const values = require("lodash/values");
const reduce = require("lodash/reduce");
const assign = require("lodash/assign");
const each = require("lodash/each");
const without = require("lodash/without");
const find = require("lodash/find");
export class AccessorManager {
    constructor() {
        this.accessors = [];
        this.queryAccessor = noopQueryAccessor;
        this.statefulAccessors = {};
    }
    getAccessors() {
        return this.accessors;
    }
    getActiveAccessors() {
        return filter(this.accessors, { active: true });
    }
    getStatefulAccessors() {
        return values(this.statefulAccessors);
    }
    getAccessorsByType(type) {
        return filter(this.accessors, Utils.instanceOf(type));
    }
    getAccessorByType(type) {
        return find(this.accessors, Utils.instanceOf(type));
    }
    add(accessor) {
        if (accessor instanceof StatefulAccessor) {
            if (accessor instanceof BaseQueryAccessor && accessor.key == "q") {
                if (this.queryAccessor !== noopQueryAccessor) {
                    throw new Error("Only a single instance of BaseQueryAccessor is allowed");
                }
                else {
                    this.queryAccessor = accessor;
                }
            }
            let existingAccessor = this.statefulAccessors[accessor.key];
            if (existingAccessor) {
                if (existingAccessor.constructor === accessor.constructor) {
                    existingAccessor.incrementRef();
                    return existingAccessor;
                }
                else {
                    throw new Error(`Multiple imcompatible components with id='${accessor.key}' existing on the page`);
                }
            }
            else {
                this.statefulAccessors[accessor.key] = accessor;
            }
        }
        accessor.incrementRef();
        this.accessors.push(accessor);
        return accessor;
    }
    remove(accessor) {
        if (!accessor) {
            return;
        }
        accessor.decrementRef();
        if (accessor.refCount === 0) {
            if (accessor instanceof StatefulAccessor) {
                if (this.queryAccessor == accessor) {
                    this.queryAccessor = noopQueryAccessor;
                }
                delete this.statefulAccessors[accessor.key];
            }
            this.accessors = without(this.accessors, accessor);
        }
    }
    getState() {
        return reduce(this.getStatefulAccessors(), (state, accessor) => {
            return assign(state, accessor.getQueryObject());
        }, {});
    }
    setState(state, _path) {
        each(this.getStatefulAccessors(), accessor => accessor.fromQueryObject(state, _path));
    }
    notifyStateChange(oldState) {
        each(this.getStatefulAccessors(), accessor => accessor.onStateChange(oldState));
    }
    getQueryAccessor() {
        return this.queryAccessor;
    }
    buildSharedQuery(query) {
        return reduce(this.getActiveAccessors(), (query, accessor) => {
            return accessor.buildSharedQuery(query);
        }, query);
    }
    buildOwnQuery(query) {
        return reduce(this.getActiveAccessors(), (query, accessor) => {
            return accessor.buildOwnQuery(query);
        }, query);
    }
    postProcessQuery(query) {
        return reduce(this.getActiveAccessors(), (query, accessor) => {
            return accessor.postProcessQuery(query);
        }, query);
    }
    buildQuery() {
        each(this.getActiveAccessors(), accessor => accessor.beforeBuildQuery());
        return this.postProcessQuery(this.buildOwnQuery(this.buildSharedQuery(new ImmutableQuery())));
    }
    setResults(results) {
        each(this.accessors, a => a.setResults(results));
    }
    resetState() {
        each(this.getStatefulAccessors(), a => a.resetState());
    }
}
//# sourceMappingURL=AccessorManager.js.map