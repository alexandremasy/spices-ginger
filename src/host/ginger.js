import { GingerModule, GingerModuleConfig, GingerView } from '../module'
import { CREATE, GingerCapabilities, isArray, PLUGINS_START, PLUGINS_COMPLETE, MIDDLEWARE_START, MIDDLEWARE_COMPLETE, READY, VIEW_BEFORE, REFRESH, sequence } from '../utils'
import { GingerPlugins, GingerStore } from './index'
import { default as installRouter } from './router'
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

    // Trigger created hooks
    this.eventbus.$emit(CREATE, {});

    // Setup the loading
    this.$c.vue.util.defineReactive(this, '_loading', true);

    // Install the plugins
    this.installPlugins(plugins)
  
    // Install (middleware)
    .then( this.installMiddlewares.bind(this, middlewares) )

    // 
    .then(() => {
      this._loading = false;
      this.eventbus.$emit(READY, {});
    });
  }

  /**
   * The eventbus
   * 
   * @returns {Vue}
   */
  get eventbus(){
    return this.$c.eventbus;
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

      let opts = { capabilities: this.$c, $ginger: this, modules: [ ...this.__modules ] };
      middlewares = middlewares.concat([GingerModulesMiddleware]);
      sequence(middlewares, opts)
      .then(() => {
        this.eventbus.$emit(MIDDLEWARE_COMPLETE, {});
        delete this.__modules;
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
    console.log('register', m);
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
        console.log('Error', err);
        reject(err);
      })
    })
  }
}