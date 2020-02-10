import fetchModule from './utils/fetch-module'

class GingerModule{
  constructor({fqn, url, options}){
    this._fqn = fqn;
    this._url = url;
    this._options = options;
    this._loaded = false;
    this._bundle = null;

    if (!fqn){
      throw new Exception('GingerModule', 'The fqn is required');
      console.trace();
    }

    if (!url){
      throw new Exception('GingerModule', 'The url is required');
      console.trace();
    }
  }

  get fqn(){
    return this._fqn;
  }

  get url(){
    return this._url;
  }

  get loaded(){
    return this._loaded;
  }

  get routes(){
    return this._bundle && this._bundle.routes ? this._bundle.routes : null;
  }

  get stores(){
    return this._bundle && this._bundle.stores ? this._bundle.stores : null;
  }

  init({http}){
    return new Promise((resolve, reject) => {
      fetchModule(this.url).then(module => {
        this._bundle = module.default;

        try {
          this._bundle.install({config: this._options, fqn: this.fqn, http});
        } catch (e) {
          console.log('install module error');
          console.log(e);
        }

        this._loaded = true;
        resolve();
      })
    });
  }
}

export default GingerModule
