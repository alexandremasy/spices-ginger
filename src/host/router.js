import { VIEW_MOUNT, VIEW_DESTROY, GingerCapabilities } from "../utils"
import { Ginger } from "."

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
          if (current && current !== to) {
            capabilities.eventbus.$emit(VIEW_DESTROY, current);
            current.view.parent.manifest.trigger(VIEW_DESTROY, current);
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
            current.view.parent.manifest.trigger(VIEW_MOUNT, current);
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