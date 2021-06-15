import { default as GingerCapabilities } from '../utils/capabilities'
import { VIEW_MOUNT, VIEW_DESTROY } from '../utils/hooks.js'
const isDef = v => v != undefined

/**
 * Router handler
 * 
 * @param {Object} options
 * @param {GingerCapabilities} options.capabilities
 * @param {Ginger} options.ginger
 */
export default ({capabilities, ginger}) => {

  let current = null;
  let updater = null;

  capabilities.router.beforeEach((to, from, next) => {
    // if (ginger.loading && isDef(current)){
    //   return next(false)
    // }

    if (to.matched && to.matched.length > 0) {

      if (updater) {
        clearInterval(updater);
      }

      updater = setInterval(() => {
        let ready = false;
        let m = to.matched[to.matched.length - 1]
        // console.log('m', m)
        ready = isDef(m) && 
                (isDef(m.components) && 
                m.components.hasOwnProperty('default')) && 
                (isDef(m.instances) && 
                m.instances.hasOwnProperty('default'))

        // to.matched.forEach(m => {
        //   console.log('instances', m, m.instances && m.instances.hasOwnProperty('default'))

        //   ready = ready || (m.components && m.components.hasOwnProperty('default'))
        // });

        if (ready) {
          clearInterval(updater);

          // Destroy event
          if (isDef(current) && current !== to) {
            if (capabilities.eventbus){
              capabilities.eventbus.$emit(VIEW_DESTROY, current);
            }

            if (isDef(current.view) && isDef(current.view.parent) && isDef(current.view.parent.manifest)){
              current.view.parent.manifest.trigger(VIEW_DESTROY, current);
            }
          }

          let c = m.components.default;
          current = {
            route: m,
            routes: to,
            component: c,
            instance: m.instances.default,
            view: ginger.getView(c.fqn)
          };
          
          if (current.view){
            capabilities.store.commit('ginger/module', current.view.$parent)
          }

          // Mount event
          try {
            if (capabilities.eventbus){
              capabilities.eventbus.$emit(VIEW_MOUNT, current);
            }
            if (isDef(current.view) && isDef(current.view.parent) && isDef(current.view.parent.manifest)) {
              current.view.parent.manifest.trigger(VIEW_MOUNT, current);
            }
          } 
          catch (error) {
              
          }
        }
      }, 100);
    }

    // head.setCurrentRoute(to);
    next();
  });
}