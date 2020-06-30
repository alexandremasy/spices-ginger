import { GingerViewContext, GingerModule } from './index'

export default class GingerView{

  /**
   * Create a Module View
   * 
   * @param {Object} options - the module option 
   * @param {Number} options.capabilities - the view capacity
   * @param {String} options.name - the name of the view
   * @param {GingerModule} options.parent - the parent module
   */
  constructor({ capabilities = GingerViewContext.SUM, name, parent}){
    this.capabilities = capabilities;
    this.name = name;
    this.parent = parent;
    this.$id = Symbol();

    this.loading = false;
    this.$el = null;
    this.$parent = null;
    this.depth = -1;
    this.layer = -1;
  }
}