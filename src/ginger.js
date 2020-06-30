import { GingerModule, GingerModuleConfig } from './module'
import { GingerCapabilities } from './utils'
import GingerStore from './store'

const isDef = v => v != undefined

export default class Ginger{
  /**
   * Constructor
   * @param {GingerCapabilities} capabilities
   * @param {Array.<GingerModuleConfig>} config 
   */
  constructor({ capabilities, config = [] }){
    this._capabilities = capabilities;
    
    // Validations
    if (!this._capabilities instanceof GingerCapabilities){
      throw new Error('@spices/ginger: The capabilities are not a valid <GingerCapabilities>');
    }
    
    // Store setup
    if (isDef(this._capabilities.store)){
      this._capabilities.store.registerModule('ginger', GingerStore);
    }
    else{
      this._capabilities.store = GingerStore;
    }

    // Router setup
    if (isDef(this._capabilities.router)){
      this._capabilities.router.beforeEach((to, from, next) => {
        console.log('to', to);
        next();
      })
    }

    this._modules = [];
    this._config = [];
    this.configure( config );
  }

  /**
   * The list of actives module. 
   * @type {Array}
   */
  get actives(){
    return this._config.filter((module) => !module.hasOwnProperty('enabled') || module.enabled === true);
  }

  /**
   * The list of routes
   */
  get routes(){
    let ret = [];
    this.actives.forEach((module, i) => {
      ret = ret.concat(module.routes);
    });

    return ret;
  }

  ////////////////////////////////////////////////////////////////////////////////

  /**
   * Configure ginger based on one or more module configuration
   * 
   * @param {Array.<GingerModuleConfig>} config 
   * @return {Array.<Promise>} - One Promise per entry
   */
  configure( config ){
    if (!Array.isArray(config)) {
      throw new Error('@spices/ginger: The config must be an Array.<GingerModuleConfig>')
    }

    return config.map(entry => { 
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
  get(fqn) {
    return this._modules.find(m => m.fqn === fqn) || null
  }

  init(fqn){
    console.log('ginger.init', fqn);
  }
    
  /**
   * Register a module
   * @param {GingerModule} module 
   * @return {Promise}
   */
  register( m ){
    if (this.get(m.fqn)){
      throw new Error(`@spices/ginger: A module with the given fqn (${fqn}) already exists`);
    }

    return new Promise((resolve, reject) => {
      this._modules.push( m );
      m.register()
      .then((manifest) => {
        console.log('module registered');
        resolve();
      })
    })
  }
}