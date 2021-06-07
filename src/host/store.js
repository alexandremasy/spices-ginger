export default {
  namespaced: true,

  state: {
    /**
     * The list of all the routes
     * 
     * @property {Array.<Object>}
     */
    routes: [],

    /**
     * The list of all the ginger modules
     * 
     * @property {Array.<GingerModule>}
     */
    modules: [],

    /**
     * The current module active
     * 
     * @property {GingerModule}
     */
    module: null,

    /**
     * The list of all the views
     * 
     * @property {Array.<GingerView>}
     */
    views: [],

    /**
     * The list of all the errors
     * 
     * @property {Array}
     */
    errors: []
  },

  /////////////////////////////////////////////////////////////////////////////////////
  
  getters: {
    /**
     * Get the list of enabled modules
     * 
     * @returns {Array.<GingerModule>}
     */
    modules: state => state.modules.filter(m => !m.hasOwnProperty('enabled') || m.enabled === true ),

    /**
     * Get the modules navigation
     * 
     * @returns {Array.<Object>}
     */
    navigation: (state, getters) => {
      let modules = getters.modules.filter(m => m.manifest.navigation.length !== 0)
      return modules.map(m => { 
        return {
          module: m, 
          children: m.manifest.navigation 
        }
      })
    },

    /**
     * Get the list of routes
     * 
     * @property {Array.<Object>}
     */
    routes: state => state.routes
  },
  
  /////////////////////////////////////////////////////////////////////////////////////

  mutations: {
    
    /**
     * Add a module to the state
     * 
     * @param {*} module 
     */
    addModule(state, module) {
      state.modules.push(module);
    },

    /**
     * Add some views to the state
     * 
     * @param {*} views 
     */
    addViews(state, views){
      state.views = state.views.concat(views);
    },

    addRoutes(state, routes) {
      state.routes = state.routes.concat(routes);
    },

    addError(state, error) {
      state.errors.push(error);
    },

    /**
     * Set the current module
     * 
     * @param {*} state 
     * @param {GingerModule} value 
     */
    module(state, value){
      state.module = value
    }
  }
}
