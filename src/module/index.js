import GingerManifest from '@/module/manifest'

export default class GingerModule{

  /**
   * Constructor
   * @param {GingerCapacity} capacities 
   * @param {String} fqn 
   * @param {GingerManifest | String} manifest 
   * @param {Object} options 
   * @param {String | Function} src 
   */
  constructor({ capacities, fqn, manifest, options, src}){
    this._capacities = capacities;
    this._fqn = fqn;
    this._manifest = manifest;
    this._options = options;
    this._src = src;
    
    this._loaded = false;
    this._bundle = null;
  }

  /**
   * The FQN
   * @returns {String}
   */
  get fqn(){
    return this._fqn;
  }
  
  /**
   * Whether the bundle is loaded or not
   * @returns {Boolean}
   */
  get loaded(){
    return this._loaded;
  }
  
  /**
   * The module routes
   * @return {Array}
   */
  get routes(){
    let ret = this._bundle && this._bundle.routes ? this._bundle.routes : null;
    if (this._options && this._options.router && this._options.router.prefix) {
      ret = ret.map(route => {
        route.path = this._options.router.prefix + route.path;
        return route;
      })
    }
    
    return ret;
  }
  
  /**
   * The module src
   * @return {String | Function}
   */
  get src(){
    return this._src
  }
  
  /**
   * The module stores
   * @return {Array}
   */
  get stores(){
    return this._bundle && this._bundle.stores ? this._bundle.stores : null;
  }

  /////////////////////////////////////////////////////////


  /**
   * Register the module
   * 
   * @return {Promise.<GingerManifest>}
   */
  register(){
    let p;
    if (this._manifest instanceof GingerManifest){
      p = Promise.resolve(this._manifest);
    }
    else{
      const http = this._capacities.http;
      http.get(this._manifest).then(response => {
        console.log('response', response);
      })
    }

    return p.then(manifest => {
      this._manifest = manifest
    })
  }
  

}