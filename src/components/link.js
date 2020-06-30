export default {
  name: 'GingerLink',

  render: (h) => {
    return h('router-link', {
      props:{
        to:{
          default:() => { return {
            name: 'home'
          }}
        }
      }
    })
  }
}