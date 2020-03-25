export default async function fetchModule(url) {
  const name = url.split('/').reverse()[0].match(/^(.*?)\.umd/)[1];
  console.log(name);

  if (window[name]) { 
    return window[name]; 
  }

  window[name] = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    
    let onLoad = () => {
      script.removeEventListener('load', onLoad);
      script.removeEventListener('error', onError);
      
      console.log('load complete', name);
      resolve(window[name]);
    };

    let onError = () => {
      script.removeEventListener('load', onLoad);
      script.removeEventListener('error', onError);
      
      reject( new Error(`Error loading ${url}`) );
    };

    script.addEventListener('load', onLoad);
    script.addEventListener('error', onError);
    script.src = url;
    document.head.appendChild(script);
  });

  return window[name];
}
