import { GingerModule, GingerModuleConfig, GingerView } from '../module'
import { CREATE, GingerCapabilities, isArray, PLUGINS_START, PLUGINS_COMPLETE, MIDDLEWARE_START, MIDDLEWARE_COMPLETE, READY } from '../utils'
import { GingerPlugins, GingerStore } from './index'
import { GingerModulesMiddleware } from './middlewares'

const isDef = v => v != undefined

export default class Ginger{

  /**
   * Constructor
   * @param {GingerCapabilities} capabilities
   * @param {VueComponent} loader
   * @param {Array.<Object>} middlewares
   * @param {Array.<GingerModuleConfig>} modules 
   */
  constructor({ capabilities, loader, middlewares = [], modules = [], plugins = [] }){
    this._capabilities = capabilities;
    this._loader = loader;
    
    // Validations
    if (!this._capabilities instanceof GingerCapabilities){
      throw new Error('@spices/ginger: The capabilities are not a valid <GingerCapabilities>');
    }
    
    // Store setup
    this._store = GingerStore;
    if (isDef(this._capabilities.store)){
      this._capabilities.store.registerModule('ginger', this._store);
    } 
    
    this.__modules = modules;
    this._modules = [];
    this._config = [];

    // Trigger created hooks
    this.eventbus.$emit(CREATE, {});

    // Setup the loading
    this._capabilities.vue.util.defineReactive(this, '_loading', true);

    // Install the plugins
    this.installPlugins(plugins)
  
    // Install (middleware)
    .then( this.installMiddlewares.bind(this, middlewares) )

    // 
    .then(() => {
      this.eventbus.$emit(READY, {});
    })

    // Start (modules)
    // Promise.all(this.configure( modules ))
    // .then(() => {
    //   this._loading = false;
    // });
  }

  /**
   * The eventbus
   * 
   * @returns {Vue}
   */
  get eventbus(){
    return this._capabilities.eventbus;
  }
  
  /**
   * Whether or not a module is loading
   * 
   * @property {Boolean}
   */
  get loading(){
    return this._loading;
  }
  
  /**
   * The store to use to save the states of data
   * 
   * @returns {Object}
   */
  get store(){
    return this._store;
  }
  
  ////////////////////////////////////////////////////////////////////////////////

  /**
   * Install the middlewares
   * 
   * @private
   * @param {Array.<Function>} middlewares
   * @returns {Promise}
   */
  installMiddlewares(middlewares){
    return new Promise((resolve, reject) => {
      this.eventbus.$emit(MIDDLEWARE_START, {});

      let opts = { capabilities: this._capabilities, $ginger: this, modules: this.__modules };
      middlewares = middlewares.concat([GingerModulesMiddleware]);
      middlewares = middlewares.map( m => m.call(m, opts) );
      
      Promise.all(middlewares)
      .then(() => {
        this.eventbus.$emit(MIDDLEWARE_COMPLETE, {});
        resolve()
      })
      .catch(reject)
    })

  }

  /**
   * Install the plugins
   * 
   * @private
   * @param {Array.<Function} plugins The list of plugins to install
   */
  installPlugins(plugins){
    return new Promise((resolve, reject) => {
      this.eventbus.$emit(PLUGINS_START, {});
      
      if (isArray(plugins)) {
        plugins.forEach(p => GingerPlugins.install(p, this._capabilities))
      }
      
      this.eventbus.$emit(PLUGINS_COMPLETE, {});
      resolve();
    })
  }

  /**
   * Return the module base on the given fqn
   * @param {String} fqn 
   * @returns {GingerModule}
   */
  getModule(fqn) {
    return this._modules.find(m => m.fqn === fqn) || null
  }

  /**
   * Return the view linked to the given fqn
   * 
   * @param {String} fqn The view fqn to retrieve
   * @returns {GingerView}
   */
  getView(fqn){
    let ret = null;
    this._modules.forEach(m => {
      let v = m.getView(fqn);
      if (isDef(v)) {
        ret = v;
      }
    });

    return ret;
  }

  /**
   * Return the view linked to the given fqn
   * 
   * @param {String} fqn The view to retrieve
   * @returns {Promise}
   */
  view(fqn){
    let ret = null;

    return new Promise((resolve, reject) => {
      // 1. find the view
      ret = this.getView(fqn);

      // 2a. Not found 
      if (!ret){
        return reject(`@spices/ginger: The requested views can not be found (${fqn})`);
      }

      // 2b. Trigger hooks
      ret.parent._manifest.trigger('before', {
        view: ret
      });

      // 2c. Fetch the view
      ret.fetch()
      .then(() => {
        resolve(ret.component);
      })

      return ret;
    })
  }

  /**
   * Register a module
   * @param {GingerModule} module 
   * @return {Promise}
   */
  register( m ){
    if (!m instanceof GingerModuleConfig) {
      throw new Error('@spices/ginger: The module must be an instance of <GingerModuleConfig>')
    }
    
    if (!m.fqn){
      throw new Error('@spices/ginger: The module must be have a fqn');
    }

    if (this.getModule(m.fqn)){
      throw new Error(`@spices/ginger: A module with the given fqn (${m.fqn}) already exists`);
    }


    return new Promise((resolve, reject) => {
      this._modules.push( m );
      
      m.register()
      .then(() => {
        resolve();
      })
      .catch(err => {
        console.log('Error', err);
        reject(err);
      })
    })
  }
}