import { default as GingerModule } from '../module/module'
import { default as GingerModuleConfig } from '../module/config'
import { default as GingerView } from '../module/view'

import { default as GingerCapabilities } from '../utils/capabilities'
import { isArray } from '../utils/type'
import { CREATE, ERROR, PLUGINS_START, PLUGINS_COMPLETE, MIDDLEWARE_START, MIDDLEWARE_COMPLETE, READY, VIEW_BEFORE } from '../utils/hooks'
import { default as sequence } from '../utils/promise'

import { default as GingerPlugins } from './plugins'
import { default as GingerStore } from './store'
import { default as installRouter } from './router'
import { default as GingerModulesMiddleware } from './middlewares/module'

const isDef = v => v != undefined

export default class Ginger{

  /**
   * Constructor
   * @param {Object} options
   * @param {GingerCapabilities} options.capabilities
   * @param {VueComponent} options.loader
   * @param {Array.<Object>} options.middlewares
   * @param {Array.<GingerModuleConfig>} options.modules 
   * @param {Object} options.options
   * @param {Array.<GingerPlugins>} options.plugins
   */
  constructor({ capabilities, loader, middlewares = [], modules = [], options = {}, plugins = [] }){
    this.$c = capabilities;
    this._loader = loader;
    
    // Validations
    if (!this.$c instanceof GingerCapabilities){
      throw new Error('@spices/ginger: The capabilities are not a valid <GingerCapabilities>');
    }

    // Store setup
    this._store = GingerStore;
    if (this.$c.hasStore) {
      this.$c.store.registerModule('ginger', this._store);
    }

    // Router setup
    if (this.$c.hasRouter){
      installRouter({ capabilities, ginger: this });
    }
    
    this.__modules = modules;
    this._modules = [];
    this._config = [];
    this._options = options;

    // Trigger created hooks
    this.eventbus.$emit(CREATE, {});

    // Setup the loading
    this.$c.vue.util.defineReactive(this, '_loading', true);
    this.$c.vue.util.defineReactive(this, '_errored', false);

    // Install the plugins
    this.installPlugins(plugins)
  
    // Install (middleware)
    .then( this.installMiddlewares.bind(this, middlewares) )

    // Wait 100ms for the application to cope with the module installation
    .then(() => {
      setTimeout(() => {
        this._loading = false;
        this.eventbus.$emit(READY, {});
      }, 100);
    })

    // Error handling
    .catch(e => {
      this._loading = false;
      this._errored = true;

      this.eventbus.$emit(ERROR, {error: e})
    })
  }

  /**
   * The eventbus
   * 
   * @property {Vue}
   * @readonly
   */
  get eventbus(){
    return this.$c.eventbus;
  }

  /**
   * The loader to use
   * 
   * @property {VueComponent}
   * @readonly
   */
  get loader(){
    return this._loader
  }
  
  /**
   * Whether or not a module is loading
   * 
   * @property {Boolean}
   * @readonly
   */
  get loading(){
    return this._loading;
  }
  
  /**
   * The custom options object
   * @property {Object}
   */
  get options(){
    return this._options
  }
  set options(value){
    this._options = value
  }

  /**
   * The store to use to save the states of data
   * 
   * @returns {Object}
   * @readonly
   */
  get store(){
    return this._store;
  }
  
  ////////////////////////////////////////////////////////////////////////////////

  /**
   * Add the module to the list of modules to preload by the middleware
   * 
   * @param {GingerModuleConfig} m The module config
   */
  add(m) {
    this.__modules.push(m);
  }

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

      let opts = { capabilities: this.$c, $ginger: this, modules: this.__modules };
      middlewares = middlewares.concat([GingerModulesMiddleware]);

      sequence(middlewares, opts)
      .then(() => {
        this.eventbus.$emit(MIDDLEWARE_COMPLETE, {});
        delete this.__modules;
        resolve()
      })
      .catch(e => reject(e))
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
        plugins.forEach(p => GingerPlugins.install(p, this.$c))
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
      let args = { view: ret };
      this.eventbus.$emit(VIEW_BEFORE, args);
      ret.parent._manifest.trigger(VIEW_BEFORE, args);

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
   * 
   * @param {GingerModule} module 
   * @return {Promise}
   */
  register( m ){
    if (!m instanceof GingerModule) {
      throw new Error('@spices/ginger: The module must be an instance of <GingerModule>')
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
        reject(err);
      })
    })
  }
}