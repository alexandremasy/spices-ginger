export default async function fetchModule(url) {
  const name = url.split('/').reverse()[0].match(/^(.*?)\.umd/)[1];

  if (window[name]) { 
    return window[name]; 
  }

  window[name] = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    script.addEventListener('load', onLoad);
    script.addEventListener('error', onError);
    
    let onLoad = () => {
      script.removeEventListener('load', onLoad);
      script.removeEventListener('error', onError);

      resolve(window[name]);
    };

    let onError = () => {
      reject( new Error(`Error loading ${url}`) );
    };

    script.src = url;
    document.head.appendChild(script);
  });

  return window[name];
}
