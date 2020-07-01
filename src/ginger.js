import { GingerModule, GingerModuleConfig, GingerView } from './module'
import { GingerCapabilities } from './utils'
import GingerStore from './store'

const isDef = v => v != undefined

export default class Ginger{
  /**
   * Constructor
   * @param {GingerCapabilities} capabilities
   * @param {Array.<GingerModuleConfig>} modules 
   */
  constructor({ capabilities, modules = [] }){
    this._capabilities = capabilities;
    
    // Validations
    if (!this._capabilities instanceof GingerCapabilities){
      throw new Error('@spices/ginger: The capabilities are not a valid <GingerCapabilities>');
    }
    
    // Store setup
    isDef(this._capabilities.store) ? this._capabilities.store.registerModule('ginger', GingerStore) : this._capabilities.store = GingerStore;
    
    // Router setup
    if (isDef(this._capabilities.router)){
      // this._capabilities.router.beforeEach((to, from, next) => {
      //   // console.log('to', to);
      //   next();
      // })
    }
    
    this._modules = [];
    this._config = [];
    this._capabilities.vue.util.defineReactive(this, '_loading', true);
    Promise.all(this.configure( modules ))
    .then(() => {
      this._loading = false;
    });
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
    return this._capabilities.store;
  }
  
  ////////////////////////////////////////////////////////////////////////////////

  /**
   * Configure ginger based on one or more module configuration
   * 
   * @param {Array.<GingerModuleConfig>} modules 
   * @return {Array.<Promise>} - One Promise per entry
   */
  configure(modules){
    if (!Array.isArray(modules)) {
      throw new Error('@spices/ginger: The config must be an Array.<GingerModuleConfig>')
    }

    return modules.map(entry => { 
      if (!entry instanceof GingerModuleConfig) {
        throw new Error('@spices/ginger: The config must be an Array.<GingerModuleConfig>')
      }

      return this.register(new GingerModule({
        capabilities: this._capabilities,
        config: entry
      }))
    });
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

      // 2b. Fetch the view
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
    if (this.getModule(m.fqn)){
      throw new Error(`@spices/ginger: A module with the given fqn (${fqn}) already exists`);
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