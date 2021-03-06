import {ESTransport} from "./transport"
import {SearchkitManager} from "./SearchkitManager";

export class SearchRequest {

  active:boolean
  constructor(public transport:ESTransport,
              public query:Object,
              public searchkit:SearchkitManager,
              public srcQuery?:Object){
    this.active = true
  }

  run(){
    return this.transport.search(this.query).then(
      this.setResults.bind(this)
    ).catch(
      this.setError.bind(this)
    )
  }

  deactivate(){
    this.active = false
  }

  setResults(results){
    if(this.active){
      this.searchkit.setResults(results, this.srcQuery)
    }
  }

  setError(error){
    if(this.active){
      this.searchkit.setError(error)
    }
  }


}
