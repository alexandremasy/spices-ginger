export default class GingerModuleConfig{

  /**
   * Constructor
   * @param {Boolean} enabled 
   * @param {String} fqn 
   * @param {String} name 
   * @param {GingerManifest | String} manifest 
   * @param {Object} options 
   * @param {Bundle | String} src 
   */
  constructor({enabled, fqn, name, manifest, options, src}){
    this._enabled = enabled;
    this._fqn = fqn;
    this._name = name;
    this._manifest = manifest;
    this._options = options;
    this._src = src;
  }
}