export default {
  name: 'GingerView',
  functional: true,

  props: {
    name: {
      type: String,
      required: true
    }
  },

  render(_, { props, children, parent, data }) {
    const h = parent.$createElement;
    const ginger = parent.$ginger;
    
    if (ginger.loading){
      // console.warn('@spices/ginger modules are still loading. View rendering delayed after the loading');
      return;
    }

    const name = props.name;
    const view = ginger.getView(name);
    // console.log('view :>> ', view.loaded);

    if (!view.loaded){
      view.fetch();
      return h('h1', 'loading view: ' + name);
    }
    else{
      return h(view.component)
    }



    ginger.getView(name)
    .then((component) => {
      console.log('ginger-view', name, component);
    })

    // console.log('render :>> ', name);
  }
}

// (resolve, reject) => {
//   console.log('view', arguments);
//   console.log('resolve', resolve);
//   console.log('parent', $parent);
//   setTimeout(() => {
//     resolve({
//       name: 'GingerView',
//       template: '<h1>Coucou</h1>'
//     })
//   }, 1000);
// }