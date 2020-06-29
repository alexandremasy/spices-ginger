import uuid from '../helpers/uuid'

export default async function fetchModule({url, name}) {
  // const name = url.split('/').reverse()[0].match(/^(.*?)\.umd/)[1];

  if (window[name]) {
    return window[name];
  }

  let ret = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    script.type = 'module';

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
