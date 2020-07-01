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

    this._beforeHooks = [];
    this._createdHooks = [];
    this._destroyHooks = [];
    this._loadHooks = [];
    this._mountHooks = [];
    this._progressHooks = [];
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

  /////////////////////////////////////////////////////////////////////////////////
  
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

    ret._beforeHooks = data._beforeHooks || [];
    ret._createdHooks = data._createdHooks || [];
    ret._destroyHooks = data._destroyHooks || [];
    ret._loadHooks = data._loadHooks || [];
    ret._mountHooks = data._mountHooks || [];
    ret._progressHooks = data._progressHooks || [];

    return ret;
  }
  
  /////////////////////////////////////////////////////////////////////////////////
  
  /**
   * Before view load hooks
   * 
   * @param {Function} fn 
   */
  before(fn){
    this._beforeHooks.push(fn);
  }
  
  /**
   * Creation hooks
   * 
   * @param {Function} fn 
   */
  created(fn){
    this._createdHooks.push(fn)
  }  
  
  /**
   * View Destroy hooks
   * 
   * @param {Function} fn 
   */
  destroy(fn){
    this._destroyHooks.push(fn)
  }
  
  /**
   * View Loaded hooks
   * 
   * @param {Function} fn 
   */
  load(fn){
    this._loadHooks.push(fn)
  }
  
  /**
   * View Mount(ing-ed) hooks
   * 
   * @param {Function} fn 
   */
  mount(fn){
    this._mountHooks.push(fn)
  }
  
  /**
   * Load progress hooks
   * 
   * @param {Function} fn 
   */
  progress(fn){
    this._progressHooks.push(fn)
  }

  /**
   * Trigger the hooks
   * 
   * @private
   * @param {String} stage
   * @param {*} args 
   */
  trigger(stage, args){
    let hooks = [];
    if (stage === 'created'){ hooks = this._createdHooks }
    if (stage === 'before'){ hooks = this._beforeHooks }
    if (stage === 'destroy'){ hooks = this._destroyHooks }
    if (stage === 'load'){ hooks = this._loadHooks }
    if (stage === 'mount'){ hooks = this.mountHooks }
    if (stage === 'progress'){ hooks = this._progressHooks }

    if (hooks.length > 0){
      hooks.forEach( h => h.call(h, args) )
    }
  }
}