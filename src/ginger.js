import GingerModule from './module'
import GingerStore from './data/store'

class Ginger{
  constructor({config, http, router, store}){
    this.http = http;
    this.config = null;
    this.router = router;
    this.store = store;
    this.modules = [];

    this.store.registerModule('ginger', GingerStore);
    this._init({config});
  }

  /**
   * Base of the config get the module enabled.
   * @return {Array} The enabled modules
   */
  get actives(){
    return this.config.filter((module) => !module.hasOwnProperty('enabled') || module.enabled === true);
  }

  /**
   * The routes from all the enabled modules.
   * @return {Array} The routes
   */
  get routes(){
    let ret = [];
    this.modules.forEach((module, i) => {
      ret = ret.concat(module.routes);
    });

    return ret;
  }

  /**
   * Register a module
   * @param  {String} fqn     The unique identifier of the module
   * @param  {String} url     The url to load the module
   * @param  {object} options A configuration object.
   */
  register({fqn, url, ...options}){
    return new Promise((resolve, reject) => {
      let module = this.modules[fqn] = new GingerModule({fqn, url, options})
      module.init({http: this.http})
      .then(() => {
        // module routes
        let r = module.routes;
        if (r){
          this.store.dispatch('ginger/setRoutes', r);
          this.router.addRoutes(r);
        }

        // module stores
        if (module.stores){
          module.stores.forEach(store => {
            this.store.registerModule(module.fqn, store);
          });
        }
        console.group('@spices/ginger', module.fqn);
        console.log('%d store(s)', Object.keys(module.stores).length);
        console.log('%d route(s)', r.length);
        console.groupEnd('@spices/ginger', module.fqn);

        // done
        resolve();
      });
      this.store.dispatch('ginger/register', module);
    })
  }

  /**
   * Initialized the ginger plugin
   * @param  {Array | url} config Either an Array with the module configure or
   */
  _init({config}){
    this._configure({config})
    .then(() => { this._autoRegister() });
  }

  /**
   * Resolve the configuration of the module either via a direct Array
   * or via an url to load a config json file.
   * @param  {Array | url} config Either an Array with the module configure or
   * the path to a json config file.
   * @return {Promise}            The configuration object.
   */
  _configure({config}){
    return new Promise((resolve, reject) => {
      if (typeof config == 'Array'){
        this.config = config;
        console.log('Ginger configured: %d module active(s)', this.actives.length);
        resolve(this.config);
      }
      else{
        getConfig({http: this.http, url: config})
        .then((config) => {
          this.config = config;
          console.log('Ginger configured: %d module active(s)', this.actives.length);
          resolve(this.config);
        })
        .catch((error) => {
          reject(error);
        });
      }
    })
  }

  /**
   * Register all the active modules
   * @return {Promise}
   */
  _autoRegister(){
    let r = this.actives.map((module, i) => {
      return this.register(module);
    });

    return Promise.all(r);
  }
}

function getConfig({http, url}){
  return new Promise((resolve, reject) => {
    http.get(url)
    .then((response) => {
      const data = response.data;
      if (data.hasOwnProperty('modules')){
        resolve(data.modules);
      }
      else {
        resolve([])
      }
    })
    .catch(error => {
      console.error('getConfig', error);
    })
  });
}

export default Ginger
