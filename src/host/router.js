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
    if (to.matched && to.matched.length > 0) {
      if (updater) {
        clearInterval(updater);
      }

      updater = setInterval(() => {
        let ready = false;

        to.matched.forEach(m => {
          ready = ready || (m.components && m.components.hasOwnProperty('default'))
        });

        if (ready) {
          clearInterval(updater);

          // Destroy event
          if (isDef(current) && current !== to) {
            capabilities.eventbus.$emit(VIEW_DESTROY, current);

            if (isDef(current.view) && isDef(current.view.parent) && isDef(current.view.parent.manifest)){
              current.view.parent.manifest.trigger(VIEW_DESTROY, current);
            }
          }

          let m = to.matched.pop();
          let c = m.components.default;
          current = {
            route: m,
            routes: to,
            component: c,
            instance: m.instances.default,
            view: ginger.getView(c.fqn)
          };

          // Mount event
          try {
            capabilities.eventbus.$emit(VIEW_MOUNT, current);
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