import GingerModuleCapacity from './capacity'
import Semver from '../helpers/semver'
import SemverVersion from '../helpers/semver';

export default class GingerModuleManifest{

  /**
   * Create a Module Manifest
   * 
   * @param {Object} options - The manifest options
   * @param {Object} options.name - The name of the module 
   * @param {Object} options.navigation - The module navigation 
   * @param {Array.<String>} options.routes - The list of routes 
   * @param {SemverVersion} options.version - The version of the module 
   * @param {Array.<String>}  options.views - The list of views 
   */
  constructor({ name, navigation, routes, version, views }){
    this._name = name;
    this._navigation = navigation;
    this._routes = routes;
    this._version = new SemverVersion(version || '0.0.0');
    this._views = views;
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

  static instanciate(data){
    let ret = new GingerModuleManifest({
      name: data._name, 
      navigation: data._navigation,
      routes: data._routes,
      version: data._version.version,
      views: data._views
    });
    
    console.log(data);
    return ret;
  }
}