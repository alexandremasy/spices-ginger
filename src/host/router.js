import { VIEW_MOUNT, VIEW_DESTROY } from "../utils";

export default ({capabilities}) => {

  let current = null;
  let entries = [];
  let updater = null;

  capabilities.router.beforeEach((to, from, next) => {

    console.log('from', from);

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
          }

          let m = to.matched[0];
          current = {
            route: m,
            component: m.components.default,
            instance: m.instances.default
          };

          // Mount event
          capabilities.eventbus.$emit(VIEW_MOUNT, current);
        }
      }, 100);
    }

    // head.setCurrentRoute(to);
    next();
  });
}