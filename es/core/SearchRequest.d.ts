import { ESTransport } from "./transport";
import { SearchkitManager } from "./SearchkitManager";
export declare class SearchRequest {
    transport: ESTransport;
    query: Object;
    searchkit: SearchkitManager;
    srcQuery?: Object;
    active: boolean;
    constructor(transport: ESTransport, query: Object, searchkit: SearchkitManager, srcQuery?: Object);
    run(): any;
    deactivate(): void;
    setResults(results: any): void;
    setError(error: any): void;
}
