import { SemverVersion } from '../utils'

export default class GingerModuleManifest{

  /**
   * Create a Module Manifest
   * 
   * @param {Object} options - The manifest options
   * @param {Boolean} optins.enabled - Whether or not the module is enabled
   * @param {Object} options.name - The name of the module 
   * @param {Object} options.navigation - The module navigation 
   * @param {Array.<String>} options.routes - The list of routes 
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

  get enabled(){
    return this._enabled;
  }

  get name(){
    return this._name
  }

  get navigation(){
    return this._navigation
  }

  get routes(){
    return this._routes;
  }

  get version(){
    return this._version;
  }

  get views(){
    return this._views;
  }

  set parent(value){
    this.$parent = value;
    this.views.forEach( v => v.$parent = value );
  }

  static instanciate(data){
    let ret = new GingerModuleManifest({
      enabled: data._enabled,
      name: data._name, 
      navigation: data._navigation,
      routes: data._routes,
      version: data._version.version,
      views: data._views
    });

    
    return ret;
  }
}