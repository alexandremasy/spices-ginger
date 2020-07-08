import { default as Ginger } from './host/ginger'
import { default as GingerRouterView } from './host/components/router'
import { default as GingerView } from './host/components/view'

import { default as GingerCapabilities } from './utils/capabilities'

const VueGinger = {};
export let _Vue;

VueGinger.install = function (Vue, opts) {

  if (VueGinger.installed && _Vue === Vue){ return; }
  _Vue = Vue;

  let o = opts || {};
  let c = GingerCapabilities.instantiate(o, Vue);
  let g = new Ginger({
    capabilities: c,
    loader: o.loader || null,
    middlewares: o.middlewares || [],
    modules: o.modules || [],
    plugins: o.plugins || []
  });
  
  // Install the $ginger utility
  Object.defineProperty(Vue.prototype, '$ginger', {
    get() { return g }
  })
  window.$ginger = g;

  // Install the components
  Vue.component('ginger-router-view', GingerRouterView);
  Vue.component('ginger-view', GingerView);
}

export default VueGinger
