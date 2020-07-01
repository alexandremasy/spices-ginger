import { GingerCapabilities, UMD } from '../utils'
import { GingerModuleManifest } from './index'
const isDef = v => v != undefined && v != null

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
    if (isDef(this._options) && isDef(this._options.router) && isDef(this._options.router.prefix)) {
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
    return isDef(this._bundle) && isDef(this._bundle.stores) ? this._bundle.stores : null;
  }

  /**
   * The list of views
   * 
   * @return {Array.GingerView}
   */
  get views(){
    return isDef(this._manifest) && isDef(this._manifest.views) ? this._manifest.views : [];
  }

  /////////////////////////////////////////////////////////

  /**
   * Returns the module view with the given fqn
   * 
   * @param {GingerView} fqn FQN of the view to retrieve
   */
  getView(fqn) {
    return this.views.find(v => v.fqn === fqn)
  }

  /**
   * Whether or not the given fqn is a view of this module
   * 
   * @param {Boolean} fqn The view fqn to search for
   */
  hasView(fqn){
    return !!this.getView(fqn);
  }

  /**
   * Register the module
   * 
   * @return {Promise.<GingerModuleManifest>}
   */
  register(){
    
    if (isDef(this._manifest)){
      return Promise.resolve(this._manifest);
    }
    
    return new Promise((resolve, reject) => {
      UMD.fetch({ 
        name: `${this.fqn}-manifest`,
        url: this._config.manifest
      })
      .then(() => {
        let log = [];

        this._bundle = window[this.fqn].default;
        this._manifest = GingerModuleManifest.instanciate(this._bundle);
        this._manifest.parent = this;

        // Register in the store
        if (this._capabilities.hasStore){
          this._capabilities.store.dispatch('ginger/register', this);
        }
        
        // Register the routes
        if (isDef(this._manifest.routes)) {
          if (this._capabilities.hasStore){
            this._capabilities.store.dispatch('ginger/addRoutes', this._manifest.routes);
          }

          if (this._capabilities.hasRouter){
            this._capabilities.router.addRoutes(this._manifest.routes);
          }

          log.push(`${this._manifest.views.length || 0} views(s)`);
          log.push(`${this._manifest.routes.length || 0} route(s)`);
          log.push(`${this._manifest.navigation.length || 0} navigation(s)`);
        }

        // Register the stores
        if (this._manifest.stores && this._capabilities.hasStore) {
          log.push('%d stores', this._manifest.stores);

          this._manifest.stores.forEach(store => {
            this._capabilities.store.registerModule(store.name, store);
          });
        }
    
        this._capabilities.logger.debug(`${this._manifest.name}@${this._manifest.version.version}`);
        this._capabilities.logger.info(log.join(' - '));
        console.dir(this._manifest);

        // @created event
        this._manifest.trigger('created', {
          capabilities: this._capabilities,
          fqn: this.fqn,
          opts: this._config
        })
        
        return resolve();
      })
      .catch(err => reject(err))
    })
  }

}