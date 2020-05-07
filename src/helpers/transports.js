import Axios from 'axios'

export default class GingerTransports {
  
  /**
   * Constructor
   * @param {Array} transports 
   */
  constructor(transports) {
    this.list = transports;
  }

  /**
   * Return the http utility
   * @return {Axios}
   */
  get http() {
    return this.list.http || Axios.create({});
  }

  /**
   * Return a socket utility
   * 
   * @return {Object | null}
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