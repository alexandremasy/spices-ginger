import { default as SemverVersion } from '../utils/semver'
import { VIEW_CREATED, VIEW_BEFORE, VIEW_DESTROY, VIEW_LOAD, VIEW_MOUNT, VIEW_PROGRESS, MODULE_REGISTER } from '../utils/hooks'
import { default as GingerView } from './view'

/**
 * @class
 */
export default class GingerModuleManifest {

  /**
   * Create a Module Manifest
   * 
   * @param {Object} options - The manifest options
   * @param {Boolean} optins.enabled - Whether or not the module is enabled
   * @param {String} optins.icon - The module icon
   * @param {Array} optins.icons - The module icons
   * @param {Object} options.name - The name of the module 
   * @param {Array} options.navigation - The navigation throughout the module
   * @param {Array.<Object>} options.routes - The list of routes availabe inside the module
   * @param {SemverVersion} options.version - The version of the module 
   * @param {Array.<String>}  options.views - The list of views 
   */
  constructor({ enabled = true, icon, icons, name, navigation, routes, stores, version, views }){
    this._enabled = enabled;
    this._icon = icon;
    this._icons = icons;
    this._name = name;
    this._navigation = navigation || [];
    this._routes = routes || [];
    this._stores = stores || [];
    this._version = new SemverVersion(version || '0.0.0');
    this._views = views;

    this.$parent = null;

    this._beforeHooks = [];
    this._createdHooks = [];
    this._destroyHooks = [];
    this._loadHooks = [];
    this._mountHooks = [];
    this._progressHooks = [];
    this._registerHooks = [];
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
   * The module primary icon
   * 
   * @property {String}
   */
  get icon(){
    return this._icon
  }

  /**
   * The module list of icons
   * 
   * @property {Array}
   */
  get icons(){
    return this._icons
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
   * The list of stores available inside the module
   * 
   * @property {Array}
   */
  get stores(){
    return this._stores
  }
  set stores(value){
    this._stores = value
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
      icon: data._icon,
      icons: data._icons,
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
    ret._registerHooks = data._registerHooks || [];

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
   * View Creation hooks
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
   * Register module hooks
   * 
   * @param {Function} fn 
   */
  register(fn){
    this._registerHooks.push(fn)
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
    if (stage === MODULE_REGISTER){ hooks = this._registerHooks }
    if (stage === VIEW_CREATED){ hooks = this._createdHooks }
    if (stage === VIEW_BEFORE){ hooks = this._beforeHooks }
    if (stage === VIEW_DESTROY){ hooks = this._destroyHooks }
    if (stage === VIEW_LOAD){ hooks = this._loadHooks }
    if (stage === VIEW_MOUNT){ hooks = this._mountHooks }
    if (stage === VIEW_PROGRESS){ hooks = this._progressHooks }

    if (hooks.length > 0){
      hooks.forEach( h => h.call(h, args) )
    }
  }
}