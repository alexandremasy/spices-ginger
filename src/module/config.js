import uuid from '@/helpers/uuid'

export default class GingerModuleConfig{

  /**
   * Constructor
   * @param {Boolean} enabled     - Whether the module is active or not
   * @param {String} fqn          - FQN
   * @param {String} name         - Name of the module
   * @param {String} manifest     - Path to the manifest
   * @param {Object} options      - Module options
   * @param {Bundle | String} src - Path to the bundle
   */
  constructor({enabled, fqn, name, manifest, options, src}){
    this._enabled = enabled === false;
    this._fqn = fqn || uuid();
    this._name = name;
    this._manifest = manifest;
    this._options = options;
    this._src = src;
  }

  get enabled(){
    return this._enabled;
  }

  get fqn(){
    return this._fqn;
  }

  get name(){
    return this._name;
  }

  get manifest(){
    return this._manifest;
  }

  get options(){
    return this._options;
  }

  get src(){
    return this._src
  }
}