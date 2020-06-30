import { GingerCapabilities, UMD } from '../utils'
import { GingerModuleManifest } from './index'

/**
 * @class
 */
export default class GingerModule {

  /**
   * Constructor
   * 
   * @param {Object} options - The module options
   * @param {GingerCapabilities} options.capabilities - The module capabilities 
   * @param {GingerModuleConfig} options.config - The module configuration
   */
  constructor({ capabilities, config }){
    this._capabilities = capabilities;
    this._config = config;
    this.$id = Symbol();
    
    this._loaded = false;
    this._manifest = null;
    this._bundle = null;
  }

  /**
   * The FQN
   * @returns {String}
   */
  get fqn(){
    return this._config.fqn;
  }
  
  /**
   * Whether the bundle is loaded or not
   * @returns {Boolean}
   */
  get loaded(){
    return this._loaded;
  }

  /**
   * The module options
   * @return {Object}
   */
  get options(){
    return this._config.options
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
    return this._config.src
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
   * @return {Promise.<GingerModuleManifest>}
   */
  register(){
    this._capabilities.logger.group(this.fqn);
    
    if (this._manifest){
      return Promise.resolve(this._manifest);
    }
    
    return new Promise((resolve, reject) => {
      UMD.fetch({ 
        name: `${this.fqn}-manifest`,
        url: this._config.manifest
      })
      .then(() => {
        this._manifest = GingerModuleManifest.instanciate(window[this.fqn].default);
        this._manifest.parent = this;

        this._capabilities.logger.debug(`${this._manifest.name}@${this._manifest.version.version}`);
        
        // Register the routes
        if (this._manifest.routes) {
          this._capabilities.store.dispatch('ginger/addRoutes', this._manifest.routes);
          this._capabilities.router.addRoutes(this._manifest.routes);
          this._capabilities.logger.debug(`${this._manifest.routes.length || 0} route(s)`)
          this._capabilities.logger.debug(`${this._manifest.navigation.length || 0} navigation(s)`);
        }

        // Register the stores
        if (this._manifest.stores) {
          this._capabilities.logger.debug('%d stores', this._manifest.stores);

          this._manifest.stores.forEach(store => {
            this._capabilities.store.registerModule(store.name, store);
          });
        }
    
        console.dir(this._manifest);
        this._capabilities.logger.groupEnd(this.fqn);
        return resolve();
      })
      .catch(err => reject(err))
    })
  }

}