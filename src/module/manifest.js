import { SemverVersion } from '../utils'
import { GingerView, GingerModule } from '.';

export default class GingerModuleManifest{

  /**
   * Create a Module Manifest
   * 
   * @param {Object} options - The manifest options
   * @param {Boolean} optins.enabled - Whether or not the module is enabled
   * @param {Object} options.name - The name of the module 
   * @param {Array} options.navigation - The navigation throughout the module
   * @param {Array.<Object>} options.routes - The list of routes availabe inside the module
   * @param {SemverVersion} options.version - The version of the module 
   * @param {Array.<String>}  options.views - The list of views 
   */
  constructor({ enabled = true, name, navigation, routes, version, views }){
    this._enabled = enabled;
    this._name = name;
    this._navigation = navigation;
    this._routes = routes;
    this._version = new SemverVersion(version || '0.0.0');
    this._views = views;

    this.$parent = null;
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
   * The name of the module
   * 
   * @property {String}
   */
  get name(){
    return this._name
  }

  /**
   * The navigation throughout the module
   * 
   * @property {Array}
   */
  get navigation(){
    return this._navigation
  }

  /**
   * The list of routes availabe inside the module
   * 
   * @property {Array}
   */
  get routes(){
    return this._routes;
  }

  /**
   * The version of the module
   * 
   * @property {SemverVersion}
   */
  get version(){
    return this._version;
  }

  /**
   * The list of views
   * 
   * @property {Array.<GingerView>}
   */
  get views(){
    return this._views;
  }

  /**
   * The module to which the manifest bellows to
   * 
   * @param {GingerModule}
   */
  set parent(value){
    this.$parent = value;
    this.views.forEach( v => v.$parent = value );
  }

  /**
   * Instantiate a manifest from its data
   * 
   * @param {Object} data 
   * @return {GingerModuleManifest}
   * @private
   */
  static instanciate(data){
    let ret = new GingerModuleManifest({
      enabled: data._enabled,
      name: data._name, 
      navigation: data._navigation,
      routes: data._routes,
      version: data._version.version,
      views: data._views.map( v => GingerView.instantiate(v) )
    });

    return ret;
  }
}