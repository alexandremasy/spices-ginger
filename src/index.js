import Ginger from './ginger'
import Capacities from './capacities'

const VueGinger = {};
VueGinger.install = function(Vue, opts){
  if (!Vue.prototype.$spices){
    Vue.prototype.$spices = {}
  }

  let o = opts || {};
  
  let capacities = new Capacities({
    eventbus: o.eventbus || null,
    transports: o.transports || null,
    logger: o.logger || null,
    store: o.store || null,
    router: o.router || null,
  });

  Vue.prototype.$spices.ginger = new Ginger({
    capacities,
    config: o.config || {},
  });
}

export {
  Ginger,
  VueGinger
}
