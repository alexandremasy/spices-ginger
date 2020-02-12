import fetchModule from './utils/fetch-module'

class GingerModule{
  constructor({eventbus, fqn, url, options}){
    this._eventbus = eventbus;
    this._fqn = fqn;
    this._url = url;
    this._options = options;
    this._loaded = false;
    this._bundle = null;

    if (!fqn){
      throw new Exception('GingerModule', 'The fqn is required');
      console.trace();
    }

    if (!url){
      throw new Exception('GingerModule', 'The url is required');
      console.trace();
    }
  }

  get fqn(){
    return this._fqn;
  }

  get url(){
    return this._url;
  }

  get loaded(){
    return this._loaded;
  }

  get routes(){
    let ret = this._bundle && this._bundle.routes ? this._bundle.routes : null;
    if (this._options && this._options.router && this._options.router.prefix){
      ret = ret.map(route => {
        route.path = this._options.router.prefix + route.path;
        return route;
      })
    }

    return ret;
  }

  get stores(){
    return this._bundle && this._bundle.stores ? this._bundle.stores : null;
  }

  init({http}){
    return new Promise((resolve, reject) => {

      if (typeof this.url === 'function'){
        let module = this.url();
        this._initModule({http, module});
        resolve();
      }

      if (typeof this.url === 'string'){
        fetchModule(this.url).then(module => {
          this._initModule({http, module});
          resolve();
        })
      }
    });
  }

  _initModule({module, http}) {
    this._bundle = module.default;
    try {
      this._bundle.install({ eventbus: this._eventbus, config: this._options, fqn: this.fqn, http });
    } catch (e) {
      console.log('install module error');
      console.log(e);
    }

    this._loaded = true;
  }
}


export default GingerModule
