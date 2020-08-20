const fetchModule = (url) => {
  const name = url.split('/').reverse()[0].match(/^(.*?)\.umd/)[1];

  if (window[name]) { 
    return window[name]; 
  }

  window[name] = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    
    let onLoad = () => {
      script.removeEventListener('load', onLoad);
      script.removeEventListener('error', onError);
      
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

export default fetchModule