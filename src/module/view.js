import { GingerViewContext, GingerModule } from './index'
import { VIEW_LOAD } from '../utils';

/**
 * A component to be used as a View. Either in the context of a route or not. 
 * n.b. this is not the instance of the view, but it's definition.
 * 
 * @class
 */
export default class GingerView{

  /**
   * Create a Module View
   * 
   * @param {Object} options - the module option 
   * @param {GingerViewContext} options.context - the view context on which the view can be displayed
   * @param {String} options.fqn - the fully qualified name of the view
   * @param {String} options.name - the name of the view
   * @param {GingerModule} options.parent - the parent module
   * @param {Promise} options.src - The Promise to resolve in order to load the view
   */
  constructor({ context = GingerViewContext.SUM, fqn, name, parent, src}){
    this._context = context;
    this._fqn = fqn;
    this._name = name;
    
    this._src = src;
    
    this.$id = Symbol();
    this.$parent = parent;
    this.$el = null;
    this._loading = false;

    this._depth = -1;
    this._layer = -1;
  }

  /**
   * The component to display
   * 
   * @return {VueComponent}
   */
  get component(){
    return this.$el;
  }

  /**
   * The view context on which the view can be displayed
   * 
   * @property {GingerViewContext}
   */
  get context(){
    return this._context;
  }

  /**
   * The fully qualified name of the view
   * 
   * @property {String}
   */
  get fqn(){
    return this._fqn;
  }

  /**
   * The unique id
   * 
   * @property {Symbol}
   */
  get id(){
    return this.$id;
  }

  /**
   * Whether the view is loaded or not
   * 
   * @returns {Boolean}
   */
  get loaded(){
    return this.$el !== null;
  }

  /**
   * The name of the view
   * 
   * @property {String}
   */
  get name(){
    return this._name;
  }

  /**
   * The parent module
   * 
   * @property {GingerModule}
   */
  get parent(){
    return this.$parent;
  }

  /**
   * The Promise to resolve in order to load the view
   * 
   * @property {Promise}
   */
  get src(){
    return this._src;
  }

  /**
   * Instanciate a View from its data. 
   * 
   * @param {*} data 
   * @private
   */
  static instantiate(data){
    let ret = new GingerView({
      context: data.context,
      fqn: data.fqn,
      name: data.name,
      parent: data.parent,
      src: data.src
    });

    return ret;
  }

  /**
   * Fetch the view
   * 
   * @returns {Promise}
   */
  fetch(){
    return new Promise((resolve, reject) => {
      if (this.loaded){
        return resolve(this.component);
      }

      this._loading = true;

      this.src()
      .then((component) => {
        this.$el = component.default;
        this.$el.fqn = this.fqn;

        // Trigger hooks
        this.parent._manifest.trigger(VIEW_LOAD, {
          view: this
        });

        resolve(this.component);
      })
      .catch(err => reject(err))
    })
  }
}