import GingerModule from '../module'
import GingerModuleConfig from '../module/config'
import GingerCapacities from '../helpers/capacities'
import Store from './data'

export default class Ginger{
  /**
   * Constructor
   * @param {GingerCapacities} capacities
   * @param {Array.<GingerModuleConfig>} config 
   */
  constructor({ capacities, config = [] }){
    this._capacities = capacities;
    
    // Validations
    if (!this._capacities instanceof GingerCapacities){
      throw new Error('@spices/ginger: The capacities are not a valid <GingerCapacities>');
    }
    
    // Initialisation
    this._capacities.store && this._capacities.store.registerModule('ginger', Store);
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
   * Return the module base on the given fqn
   * @param {String} fqn 
   * @returns {GingerModule}
   */
  get(fqn){
    return this._modules.find( m => m.fqn === fqn ) || null
  }

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
        capacities: this._capacities,
        config: entry
      }))
    });
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