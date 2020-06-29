import Ginger from './'
import GingerCapacities from '../helpers/capacities'

import { GingerLink, GingerRouterView } from './components'

const VueGinger = {};
VueGinger.install = function (Vue, opts) {
  if (!Vue.prototype.$spices) {
    Vue.prototype.$spices = {}
  }

  // Install the $spices.ginger utility
  let o = opts || {};
  Vue.prototype.$spices.ginger = new Ginger({
    capacities: new GingerCapacities({
      eventbus: o.eventbus,
      transports: o.transports,
      logger: o.logger,
      store: o.store,
      router: o.router,
    }),
    config: o.config || [],
  });

  // Install the components
  Vue.component('ginger-link', GingerLink);
  Vue.component('ginger-router-view', GingerRouterView);
}

export default VueGinger