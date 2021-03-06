import { SelectedFilter } from "./SelectedFilter";
export declare type SourceFilterType = string | Array<string> | boolean;
export declare class ImmutableQuery {
    index: any;
    query: any;
    static defaultIndex: any;
    constructor(index?: any);
    buildQuery(): void;
    hasFilters(): boolean;
    hasFiltersOrQuery(): boolean;
    addQuery(query: any): ImmutableQuery;
    setQueryString(queryString: any): ImmutableQuery;
    getQueryString(): any;
    addSelectedFilter(selectedFilter: SelectedFilter): ImmutableQuery;
    addSelectedFilters(selectedFilters: Array<SelectedFilter>): ImmutableQuery;
    getSelectedFilters(): Array<SelectedFilter>;
    addAnonymousFilter(bool: any): ImmutableQuery;
    addFilter(key: any, filter: any): ImmutableQuery;
    setAggs(aggs: any): ImmutableQuery;
    removeAggs(): ImmutableQuery;
    shouldAppendResults(): any;
    setShouldAppendResults(shouldAppendResults: boolean): ImmutableQuery;
    remove(key: any): ImmutableQuery;
    getFilters(keys?: any[]): any;
    _getFilters(keys: any, method: any): any;
    getFiltersWithKeys(keys: any): any;
    getFiltersWithoutKeys(keys: any): any;
    setSize(size: number): ImmutableQuery;
    setSort(sort: any): ImmutableQuery;
    setSource(_source: SourceFilterType): ImmutableQuery;
    setHighlight(highlight: any): ImmutableQuery;
    getSize(): any;
    setFrom(from: number): ImmutableQuery;
    getFrom(): any;
    getPage(): number;
    deepUpdate(key: any, ob: any): ImmutableQuery;
    setSuggestions(suggestions: any): ImmutableQuery;
    update(updateDef: any): ImmutableQuery;
    getJSON(): any;
    printJSON(): void;
}
