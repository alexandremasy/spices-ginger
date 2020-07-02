import { Ginger, GingerRouterView, GingerView }  from './host'
import { GingerCapabilities } from './utils'

const VueGinger = {};
VueGinger.install = function (Vue, opts) {
  let o = opts || {};
  let g = new Ginger({
    capabilities: new GingerCapabilities({
      eventbus: o.eventbus,
      transports: o.transports,
      logger: o.logger,
      store: o.store,
      router: o.router,
      vue: Vue
    }),
    modules: o.modules || [],
  });
  
  // Install the $spices.ginger utility
  Object.defineProperty(Vue.prototype, '$ginger', {
    get() { return g }
  })
  window.$ginger = g;

  // Install the components
  Vue.component('ginger-router-view', GingerRouterView);
  Vue.component('ginger-view', GingerView);

  // Install the mixins
  Vue.mixin({})
}

export default VueGinger
