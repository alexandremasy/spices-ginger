import Ginger from './ginger'
import { GingerCapabilities } from './utils'
import { GingerLink, GingerRouterView } from './components'

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
    }),
    config: o.config || [],
  });
  
  // Install the $spices.ginger utility
  if (!Vue.prototype.$spices) {
    Object.defineProperty(Vue.prototype, '$spices', {
      get() { return {} }
    })
  }

  Object.defineProperty(Vue.prototype.$spices, 'ginger', {
    get() { return g }
  })

  // Install the components
  Vue.component('ginger-link', GingerLink);
  Vue.component('ginger-router-view', GingerRouterView);

  // Install the mixins
  Vue.mixin({
    beforeCreate(){
      g.init(this);
    }
  })
}

export default VueGinger
