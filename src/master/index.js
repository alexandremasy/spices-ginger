import GingerModule from '@/module'
import GingerModuleConfig from '@/module/config'
import GingerCapacities from '@/helpers/capacities'
import Store from '@/master/data'

export default class Ginger{
  /**
   * Constructor
   * @param {GingerCapacities} capacities
   * @param {Array.<GingerModuleConfig>} config 
   */
  constructor({ capacities, config }){
    this._capacities = capacities;
    this._config = config;

    // Validations
    if (!this._capacities instanceof GingerCapacities){
      throw new Exception('@spices/ginger: The capacities are not a valid <GingerCapacities>');
    }

    if (!Array.isArray(this._config)){
      throw new Exception('@spices/ginger: The config must be an Array.<GingerModuleConfig>')
    }
    
    this._config.forEach( e => {
      if (!e instanceof GingerModuleConfig){
        throw new Exception('@spices/ginger: The config must be an Array.<GingerModuleConfig>')
      }
    })

    // Initialisation
    this._capacities.store && this._capacities.store.registerModule('ginger', Store);
    this._modules = [];
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
   * Register a module
   * @param {GingerModule} module 
   */
  register( module ){
    if (this.get(module.fqn)){
      throw new Exception(`@spices/ginger: A module with the given fqn (${fqn}) already exists`);
    }

    this._modules.push( module );
    module.register().then((manifest) => {
      console.log('module registered', manifest);
    })
  }
  
}