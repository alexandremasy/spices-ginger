/**
 * UMD Module Fetcher
 * 
 * @constructor
 */
export default class UMDFetcher {

  /**
   * Check whether or not the module already exists.
   * 
   * @param {Object} args The arguments
   * @param {String} args.name - The name of the module to look for.
   * @returns {Boolean} - Return true if the module already exists, false if not.
   * @static
   */
  static exists({ name }) {
    return window && window.hasOwnProperty(name)
  }

  /**
   * Return the umd module
   * 
   * @param {Object} args - The arguments
   * @param {String} args.name - The name of the module.
   */
  static get({ name, fn = 'default' }) {
    if (!UMDFetcher.exists(name)) {
      throw `The requested module with the name "${name}" does not exists.`
    }

    return window[name]
  }

  /**
   * Fetch an umd module
   * 
   * @param {Object} args The arguments
   * @param {String} args.url - The url to load
   * @param {String} args.name - The name of the module. Must be unique.
   * @returns {Promise}
   * @static
   */
  static fetch({ url, name }) {
    if (UMDFetcher.exists({ name })) {
      return Promise.resolve(UMDFetcher.get({ name }))
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.async = true;
      script.type = 'module';
      script.crossOrigin = 'anonymous';

      let onLoad = () => {
        script.removeEventListener('load', onLoad);
        script.removeEventListener('error', onError);

        let max = 300
        let j = 0;
        let i = setInterval(() => {
          j++
          if (UMDFetcher.exists({ name })) {
            clearInterval(i);
            return resolve(UMDFetcher.get({ name }));
          }
          
          if (j === max){
            clearInterval(i)
            console.error(`[@spices/ginger] Unable to locate the module named ${name}. Make sure it was name this way while building the library`);
            return
          }
        }, 1)
      };

      let onError = (e) => {
        script.removeEventListener('load', onLoad);
        script.removeEventListener('error', onError);

        return reject(`Error loading ${url}`);
      };

      script.addEventListener('load', onLoad);
      script.addEventListener('error', onError);
      script.src = url;
      document.head.appendChild(script);
    })
  }
}