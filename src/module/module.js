import { default as GingerCapabilities } from '../utils/capabilities'
import { default as UMD } from '../utils/umd'
import { MODULE_REGISTER, MODULE_STORES, MODULE_ROUTES } from '../utils/hooks'
import { default as GingerModuleManifest } from './manifest'
import { default as GingerView } from './view'
import { default as GingerModuleConfig } from './config'

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
   * @param {Ginger} options.$ginger - The main $ginger object
   */
  constructor({ capabilities, config, $ginger }){
    this._capabilities = capabilities;
    this._config = config;
    this.$id = Symbol();
    this.$ginger = $ginger;
    
    this._loaded = false;
    this._manifest = null;
    this._bundle = null;
  }

  /**
   * The FQN
   * @property {String}
   */
  get fqn(){
    return this._config.fqn;
  }
  
  /**
   * Whether the bundle is loaded or not
   * @property {Boolean}
   */
  get loaded(){
    return this._loaded;
  }

  /**
   * The module manifest
   * 
   * @property {GingerModuleManifest}
   */
  get manifest(){
    return this._manifest;
  }

  /**
   * The module options
   * @property {Object}
   */
  get options(){
    return this._config.options
  }
  
  /**
   * The module routes
   * @property {Array}
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
   * @property {String | Function}
   */
  get src(){
    return this._config.src
  }
  
  /**
   * The module stores
   * @property {Array}
   */
  get stores(){
    return isDef(this._bundle) && isDef(this._bundle.stores) ? this._bundle.stores : null;
  }

  /**
   * The list of views
   * 
   * @property {Array.GingerView}
   */
  get views(){
    return isDef(this._manifest) && isDef(this._manifest.views) ? this._manifest.views : [];
  }

  /////////////////////////////////////////////////////////

  /**
   * Generate a module from its config
   * 
   * @param {Object} options
   * @param {GingerCapabilities} options.capabilities
   * @param {GingerModuleConfig} options.config
   * @param {Ginger} options.$ginger
   * @returns {GingerModule}
   * @static
   */
  static fromConfig({ capabilities, config, $ginger }){
    return new GingerModule({
      capabilities, 
      config,
      $ginger
    })
  }

  /////////////////////////////////////////////////////////

  /**
   * Returns the module view with the given fqn
   * 
   * @param {String} fqn FQN of the view to retrieve
   * @returns {GingerView}
   */
  getView(fqn) {
    return this.views.find(v => v.fqn === fqn)
  }

  /**
   * Whether or not the given fqn is a view of this module
   * 
   * @param {String} fqn The view fqn to search for
   * @returns {Boolean}
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
        name: this.fqn,
        url: this._config.manifest
      })
      .then(() => {
        let log = [];

        if (!window.hasOwnProperty(this.fqn)){
          throw new Error(`@spices/ginger: The bundle with the name ${this.fqn} has been loaded but is register to a different name. Update the fqn of the module in the configuration.`);
        }

        this._bundle = window[this.fqn].default;
        this._manifest = GingerModuleManifest.instanciate(this._bundle);
        this._manifest.parent = this;
        
        // Module register event
        let args = {
          $ginger: this.$ginger,
          module: this,
        };
        this._capabilities.eventbus.$emit(MODULE_REGISTER, args);
        args.capabilities = this._capabilities;
        this._manifest.trigger(MODULE_REGISTER, args);
        
        // Register in the store
        if (this._capabilities.hasStore){
          this._capabilities.eventbus.$emit(MODULE_STORES, args);
          this._capabilities.store.dispatch('ginger/addModule', this);
        }
        
        // Register the routes
        if (isDef(this._manifest.routes)) {
          if (this._capabilities.hasStore){
            this._capabilities.store.dispatch('ginger/addRoutes', this._manifest.routes);
          }
          
          if (this._capabilities.hasRouter){
            this._capabilities.router.addRoutes(this._manifest.routes);
          }
          
          this._capabilities.eventbus.$emit(MODULE_ROUTES, args);
          log.push(`${this._manifest.views.length || 0} views(s)`);
          log.push(`${this._manifest.routes.length || 0} primary route(s)`);
          log.push(`${this._manifest.navigation.length || 0} navigation(s)`);
        }

        // Register the stores
        log.push(`${this._manifest.stores.length || 0} store(s)`);
        if (this._manifest.stores && this._capabilities.hasStore) {

          this._manifest.stores.forEach(store => {
            this._capabilities.store.registerModule(store.name, store);
          });
        }
    
        this._capabilities.logger.debug(`${this._manifest.name}@${this._manifest.version.version}`);
        this._capabilities.logger.info(log.join(' - '));
        // console.dir(this._manifest);

        return resolve();
      })
      .catch(err => reject(err))
    })
  }

}