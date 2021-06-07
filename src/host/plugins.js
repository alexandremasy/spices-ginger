import { isArray } from "../utils/type"

export default class GingerPlugins{

  /**
   * Install the given plugin
   * 
   * @param {Function} plugin 
   * @param {GingerCapabilities} capabilities 
   */
  static install({plugin, options}, capabilities){
    let payload = plugin.call(plugin, {capabilities, options});

    // Install the components
    if(isArray(payload.components)){
      payload.components.forEach((name, component) => capabilities.vue.component(name, component));
    }

    // Install the mixins
    if (payload.mixin){
      capabilities.vue.mixin( payload.mixin.call(payload.mixin, { capabilities, options }) );
    }
  }
}