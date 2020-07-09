import { Logger } from '@spices/cayenne'
import { default as GingerTransports } from './transports'

const isDef = v => v != undefined && v != null

export default class GingerCapabilities {

  /**
   * Constructor
   * 
   * @param {Object} options - All the capacities
   * @param {Vue} options.eventbus - An Vue Eventbus
   * @param {Logger} options.logger - A logger to display message in the console
   * @param {VueRouter} options.router - An instance of the Vue Router
   * @param {VueX} options.store - An instance of VueX
   * @param {GingerTransports} options.transports - The available transports
   * @param {Vue} options.vue - An instance of the current Vue
   */
  constructor({ eventbus, logger, router, store, transports, vue }) {
    this._eventbus = eventbus;
    this._logger = logger || Logger.get();
    this._router = router || null;
    this._store = store;
    this._transports = new GingerTransports(transports);
    this._vue = vue;
  }

  /**
   * The Eventbus
   * 
   * @property {Vue}
   */
  get eventbus(){
    return this._eventbus
  }
  
  /**
   * Whether or not there is a Vue Router
   * 
   * @return {Boolean}
   */
  get hasRouter() {
    return isDef(this.router)
  }

  /**
  * Whether there is a store or not
  * 
  * @returns {Boolean}
  */
  get hasStore() {
    return isDef(this.store)
  }

  /**
   * The http transport
   * 
   * @return { Axios }
   */
  get http() {
    return this.transports.http
  }

  /**
   * The logger
   * 
   * @property {Logger}
   */
  get logger(){
    return this._logger
  }

  /**
   * The Vue Router instance
   * 
   * @property {VueRouter}
   */
  get router(){
    return this._router
  }

  /**
   * The VueX instance
   * 
   * @property {VueX}
   */
  get store(){
    return this._store
  }

  /**
   * The available transports
   * 
   * @property {GingerTransports}
   */
  get transports(){
    return this._transports
  }  

  /**
   * An instance of the current Vue
   * 
   * @property {Vue}
   */
  get vue(){
    return this._vue;
  }

  /**
   * Instantiate the capabilities from the given options
   * 
   * @param {Object} options 
   * @param {Vue} vue 
   * @returns {GingerCapabilities}
   * @private
   */
  static instantiate(options, vue){
    return new GingerCapabilities({
      eventbus: options.eventbus,
      logger: options.logger,
      router: options.router,
      store: options.store,
      transports: options.transports,
      vue: vue
    })
  }
}