import fetchModule from './utils/fetch-module'

class GingerModule {

  /**
   * Constructor
   * @param {Capacities} capacities 
   * @param {String} fqn 
   * @param {Object} options 
   * @param {String} url 
   */
  constructor({ capacities, fqn, options, url }){
    this.capacities = capacities;
    this._fqn = fqn;
    this._url = url;
    this._options = options;

    this._loaded = false;
    this._bundle = null;

    if (!fqn){
      throw new Exception('GingerModule', 'The fqn is required');
    }

    if (!url){
      throw new Exception('GingerModule', 'The url is required');
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

      if (!!(this.url && this.url.constructor && this.url.call && this.url.apply)){
        let module = this.url();
        this._initModule(module);
        resolve();
      }

      if (typeof this.url === 'string'){
        let u = this.url;

        if (process.env.NODE_ENV === 'development'){
          let cache = new URL(u);
          cache.searchParams.append('v', new Date().valueOf());
          u = cache.href;
        }
        
        fetchModule(u).then(module => {
          this._initModule(module);
          resolve();
        })
        .catch(error => {
          reject(error)
        })
      }
    });
  }

  /**
   * Execute a function on the bundle
   * @param {String} action
   * @return {*}
   */
  run({action}){
    let ret = null;

    try {
      if (this._bundle && action in this._bundle){
        ret = this._bundle[action].call(this._bundle);
      }
      else{
        this.capacities.logger.warn(`Action [${action}] not found in module [${this.fqn}]`);
      }
    } catch(error) {
      this.capacities.logger.error(error);
    }

    return ret;
  }

  _initModule(module) {
    this._bundle = module.default;

    try {
      this._bundle.install({ 
        capacities: this.capacities,
        fqn: this.fqn, 
        options: this._options
      });
    } catch (e) {
      this.capacities.logger.log('install module error');
      this.capacities.logger.log(e);
    }

    this._loaded = true;
  }
}

export default GingerModule