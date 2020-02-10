import Ginger from './ginger'

const VueGinger = {};
VueGinger.install = function(Vue, opts){
  if (!Vue.spices){
    Vue.spices = {}
  }

  let o = opts || {}
  Vue.spices.ginger = new Ginger({
    config: o.config || null,
    http: o.http || null,
    router: o.router || null,
    store: o.store || null
  });
}

export {
  Ginger,
  VueGinger
}
