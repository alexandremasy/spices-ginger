import { Logger } from '@spices/cayenne'
import { GingerTransports } from './index'

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
    this.eventbus = eventbus || null;
    this.logger = logger || Logger.get();
    this.router = router || null;
    this.store = store;
    this.transports = new GingerTransports(transports);
  }

  /**
   * The http transport
   * 
   * @return { Axios }
   */
  get http() {
    return this.transports.http;
  }
}