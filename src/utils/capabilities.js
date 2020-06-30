import { Logger } from '@spices/cayenne'
import { GingerTransports } from './index'
const isDef = v => v != undefined && v != null

export default class GingerCapabilities {

  /**
   * Constructor
   * 
   * @param {Object} options - All the capacities
   * @param {Vue} options.eventbus - An Vue Eventbus
   * @param {GingerTransports} options.transports - The available transports
   * @param {Logger} options.logger - A logger to display message in the console
   * @param {VueRouter} options.router - An instance of the Vue Router
   * @param {VueX} options.store - An instance of VueX
   */
  constructor({ eventbus, transports, logger, router, store }) {
    this._eventbus = eventbus || null;
    this._logger = logger || Logger.get();
    this._router = router || null;
    this._store = store;
    this._transports = new GingerTransports(transports);
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
   * Whether or not there is a Vue Router
   * 
   * @return {Boolean}
   */
  get hasRouter() {
    return isDef(this.router)
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
}