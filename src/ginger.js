import GingerModule from './module'
import GingerStore from './data/store'

class Ginger{
  constructor({capacities, config}){
    this.config = null;
    this.capacities = capacities;
    this.capacities.parent = this;
    this.modules = [];

    this.capacities.store.registerModule('ginger', GingerStore);
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
   * Return a module based on its fqn
   * @param {String} fqn 
   * @return {GingerModule}
   */
  get(fqn){
    return fqn in this.modules ? this.modules[fqn] : null;
  }

  /**
   * Register a module
   * @param  {String} fqn     The unique identifier of the module
   * @param  {String} url     The url to load the module
   * @param  {object} options A configuration object.
   */
  register({fqn, url, options}){
    return new Promise((resolve, reject) => {
      let cap = { ...this.capacities };

      // Custom logger per module
      if (this.capacities.logger){
        cap.logger = this.capacities.logger.get({name: fqn});
      }

      let opts = {
        capacities: this.capacities,
        fqn: fqn,
        url: url,
        options: options
      };
      let module = this.modules[fqn] = new GingerModule(opts);

      module.init()
            .then(() => {
              // module routes
              let r = module.routes;
              if (r){
                this.capacities.store.dispatch('ginger/setRoutes', r);
                this.capacities.router.addRoutes(r);
              }

              // module stores
              if (module.stores){
                module.stores.forEach(store => {
                  this.capacities.store.registerModule(store.name, store);
                });
              }

              this.capacities.logger.group('@spices/ginger', module.fqn);
              this.capacities.logger.info(Object.keys(module.stores).length + ' store(s)');
              this.capacities.logger.info(r.length + ' route(s)');
              this.capacities.logger.groupEnd('@spices/ginger', module.fqn);

              // done
              resolve();
            })
            .catch(error => {
              if (process.env.NODE_ENV === 'development'){
                console.error('error', error);
              }

              this.capacities.store.dispatch('ginger/error', error);
            })
      this.capacities.store.dispatch('ginger/register', module);
    })
  }

  /**
   * Execute a function on all the module
   * 
   * @param {String} action The method name to execute
   * @return {Array}  
   */
  run({action}){
    let ret = [];

    Object.keys(this.modules).forEach(fqn => {
      let module = this.modules[fqn];
      let data = module.run({action});
      if (data){
        ret.push({
          fqn: module.fqn,
          data: data
        })
      }
    })

    return ret;
  }

  /**
   * Initialized the ginger plugin
   * @param  {Array | url} config Either an Array with the module configure or
   */
  _init({config}){
    this._configure({config})
    .then(() => { this._autoRegister() })
    .then(() => {
      if (this.capacities.eventbus){
        this.capacities.eventbus.$emit('GINGER_COMPLETE')
      }
    })
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
      if (typeof config === 'string'){
        getConfig({ http: this.capacities.http, url: config})
        .then((config) => {
          this.config = config;
          resolve(this.config);
        })
        .catch((error) => {
          reject(error);
        });
      }
      else{
        this.config = config;
        resolve(this.config);
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
      this.capacities.logger.error('getConfig', error);
    })
  });
}

export default Ginger
