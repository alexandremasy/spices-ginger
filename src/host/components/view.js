export default {
  name: 'GingerView',
  functional: true,

  props: {
    name: {
      type: String,
      required: true
    }
  },

  render(_, { props, children, listeners, parent, data }) {
    const h = parent.$createElement;
    const ginger = parent.$ginger;
    
    if (ginger.loading){
      // console.warn('@spices/ginger modules are still loading. View rendering delayed after the loading');
      return;
    }

    const name = props.name;
    const view = ginger.getView(name);

    if (!view.loaded){
      view.fetch();
      const component = $ginger.loader ? $ginger.loader : 'h1'
      return h(component, name)
    }
    else{
      return h(view.component, {
        on: listeners
      })
    }
  }
}