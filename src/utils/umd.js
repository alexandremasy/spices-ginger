/**
 * UMD Module
 * 
 * @constructor
 */
export default class UMD{

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
    if (window[name]) {
      return Promise.resolve();
    }

    let ret = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.async = true;
      script.type = 'module';
      script.crossorigin = 'anonymous';

      let onLoad = () => {
        script.removeEventListener('load', onLoad);
        script.removeEventListener('error', onError);

        resolve();
      };

      let onError = () => {
        script.removeEventListener('load', onLoad);
        script.removeEventListener('error', onError);

        reject(new Error(`Error loading ${url}`));
      };

      script.addEventListener('load', onLoad);
      script.addEventListener('error', onError);
      script.src = url;
      document.head.appendChild(script);
    });

    return ret;
  }
}