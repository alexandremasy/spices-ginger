import Ginger from './ginger'
import Capacities from './capacities'

const VueGinger = {};
VueGinger.install = function(Vue, opts){
  if (!Vue.spices){
    Vue.spices = {}
  }

  let o = opts || {};
  
  let capacities = new Capacities({
    eventbus: o.eventbus || null,
    transport: o.transport || null,
    logger: o.logger || null,
    store: o.store || null,
    router: o.router || null,
  });

  Vue.spices.ginger = new Ginger({
    capacities,
    config: o.config || {},
  });
}

export {
  Ginger,
  VueGinger
}
