import Vue from 'vue'
import { Logger } from '@spices/cayenne'

import GingerTransports from './transports'

export default class GingerCapacities {

  /**
   * Constructor
   * 
   * @param {Vue} eventbus 
   * @param {GingerTransports} transports
   * @param {Logger} logger
   * @param {VueRouter} router
   * @param {VueX} store
   */
  constructor({ eventbus, transports, logger, router, store }) {
    this.eventbus = eventbus || new Vue({});
    this.logger = logger || Logger.get();
    this.parent = null;
    this.router = router || new VueRouter({
      mode: 'history',
      base: process.env.BASE_URL,
      routes: []
    });
    this.store = store;
    this.transports = new GingerTransports(transports);
  }

  /**
   * The http transport
   * 
   * @return { Axios }
   */
  get http() {
    return this.transport.http;
  }
}