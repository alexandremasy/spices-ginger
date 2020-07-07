export default { 
  name: 'GingerRouterView',
  functional: true,
  
  render: (_, { props, children, parent, data }) => {

    const h = parent.$createElement;
    const $ginger = parent.$ginger;

    const component = $ginger.loading ? $ginger.loader || 'h1' : 'router-view';
    return h(component);
  }
}