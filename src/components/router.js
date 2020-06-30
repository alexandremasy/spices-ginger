export default { 
  name: 'GingerRouterView',
  functional: true,
  
  render: (_, { props, children, parent, data }) => {

    const h = parent.$createElement;
    const ginger = parent.$ginger;

    console.log('routerview.loading', ginger.loading);

    if (ginger.loading){
      return h('h1', 'loading')
    }
    else{
      return h('router-view')
    }


    // return h('router-view')
  }
}