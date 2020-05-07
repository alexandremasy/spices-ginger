import Ginger from '@/master'
import GingerCapacities from '@/helpers/capacities'
import GingerManifest from '@/module/manifest'

const VueGinger = {};
VueGinger.install = function(Vue, opts){
  if (!Vue.prototype.$spices){
    Vue.prototype.$spices = {}
  }

  let o = opts || {};  
  Vue.prototype.$spices.ginger = new Ginger({
    capacities: new GingerCapacities({
      eventbus: o.eventbus,
      transports: o.transports,
      logger: o.logger,
      store: o.store,
      router: o.router,
    }),
    config: o.config || {},
  });
}

export {
  Ginger,
  GingerManifest,
  VueGinger
}
