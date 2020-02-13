import fetchModule from './utils/fetch-module'

class GingerModule {

  /**
   * Constructor
   * @param {Function} dispatch 
   * @param {Vue} eventbus 
   * @param {String} fqn 
   * @param {Axios} http 
   * @param {String} url 
   * @param {Object} options 
   */
  constructor({ dispatch, eventbus, fqn, http, url, options }){
    this._dispatch = dispatch;
    this._eventbus = eventbus;
    this._fqn = fqn;
    this._http = http;
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

  /**
   * Return the fqn
   * @return {String}
   */
  get fqn(){
    return this._fqn;
  }

  /**
   * Return the url
   * @return {String}
   */
  get url(){
    return this._url;
  }

  /**
   * Return the loading state
   * @return {Boolean}
   */
  get loaded(){
    return this._loaded;
  }

  /**
   * Return the routes
   * @return {Array.<Route>}
   */
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

  /**
   * Return the stores
   * @return {Array.<Store>}
   */
  get stores(){
    return this._bundle && this._bundle.stores ? this._bundle.stores : null;
  }

  /**
   * Init the module
   * @return {Promise}
   */
  init(){
    return new Promise((resolve, reject) => {

      if (typeof this.url === 'function'){
        let module = this.url();
        this._initModule(module);
        resolve();
      }

      if (typeof this.url === 'string'){
        fetchModule(this.url).then(module => {
          this._initModule(module);
          resolve();
        })
      }
    });
  }

  _initModule(module) {
    this._bundle = module.default;

    try {
      this._bundle.install({ 
        config: this._options, 
        dispatch: this._dispatch,
        eventbus: this._eventbus, 
        fqn: this.fqn, 
        http: this._http
      });
    } catch (e) {
      console.log('install module error');
      console.log(e);
    }

    this._loaded = true;
  }
}

export default GingerModule