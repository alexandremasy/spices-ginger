import { uuid } from '../utils'

/**
 * Ginger Module Configuration
 * 
 * @class
 */
export default class GingerModuleConfig{

  /**
   * @constructor
   * @param {Object} args
   * @param {Boolean} args.enabled     - Whether the module is active or not
   * @param {String} args.fqn          - FQN
   * @param {String} args.name         - Name of the module
   * @param {String} args.manifest     - Path to the manifest
   * @param {Object} args.options      - Module options
   */
  constructor({enabled, fqn, name, manifest, options}){
    this._enabled = enabled === false;
    this._fqn = fqn || uuid();
    this._name = name;
    this._manifest = manifest;
    this._options = options;
  }

  /**
   * Whether or not the module is enabled
   * 
   * @property {Boolean}
   */
  get enabled(){
    return this._enabled;
  }

  /**
   * The unique qualified name
   * 
   * @property {String}
   */
  get fqn(){
    return this._fqn;
  }

  /**
   * The name of the module
   * 
   * @property {String}
   */
  get name(){
    return this._name;
  }

  /**
   * The path to the manifest
   * 
   * @property {String}
   */
  get manifest(){
    return this._manifest;
  }

  /**
   * this options for the module
   * 
   * @property {Object}
   */
  get options(){
    return this._options;
  }
}