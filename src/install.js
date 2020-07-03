import { Ginger, GingerPlugins, GingerRouterView, GingerView }  from './host'
import { GingerCapabilities, isArray } from './utils'

const VueGinger = {};
export let _Vue;

VueGinger.install = function (Vue, opts) {

  if (VueGinger.installed && _Vue === Vue){ return; }
  _Vue = Vue;

  let o = opts || {};
  let c = GingerCapabilities.instantiate(o, Vue);
  let g = new Ginger({
    capabilities: c,
    modules: o.modules || [],
  });
  
  // Install the $ginger utility
  Object.defineProperty(Vue.prototype, '$ginger', {
    get() { return g }
  })
  window.$ginger = g;

  // Install the components
  Vue.component('ginger-router-view', GingerRouterView);
  Vue.component('ginger-view', GingerView);

  // Install the plugins
  if (isArray(opts.plugins)){
    opts.plugins.forEach(p => GingerPlugins.install(p, c))
  }
 
}

export default VueGinger
