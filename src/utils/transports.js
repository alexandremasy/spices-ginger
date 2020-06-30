export default class GingerTransports {
  
  /**
   * Constructor
   * 
   * @param {Array} transports
   * @constructor
   */
  constructor(transports) {
    this.list = transports || {};

    if (transports && !transports.hasOwnProperty('http')){
      throw new Error('@spices/ginger: No HTTP transport available');
    }
  }

  /**
   * Return the http utility
   * 
   * @return {Axios}
   */
  get http() {
    return this.list.http || null;
  }

  /**
   * Return a socket utility
   * 
   * @return {Object}
   */
  get socket() {
    return this.list.socket || null;
  }

  /**
   * Return the connection matching the given name
   * @param {String} name 
   * @return {*}
   */
  getByName(name) {
    let ret = this.http;

    if (name) {
      ret = this.list.hasOwnProperty(name) ? this.list[name] : null;
    }

    return ret;
  }
}