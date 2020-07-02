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
    error: []
  },

  /////////////////////////////////////////////////////////////////////////////////////
  
  getters: {
    /**
     * Get the list of enabled modules
     * 
     * @returns {Array.<GingerModule>}
     */
    modules: state => state.modules.filter(m => !m.hasOwnProperty('enabled') || m.enabled === true )
  },
  
  /////////////////////////////////////////////////////////////////////////////////////

  actions: {
    /**
     * Register a module
     * 
     * @param {GingerModule} module - The module to register 
     */
    register({ commit }, module) {
      commit('addModule', module);
      commit('addViews', module.views);
    },



    error({ commit }, error) {
      commit('addError', error);
    },

    addRoutes({ commit }, routes) {
      commit('addRoutes', routes);
    },

    getRoutes({ state }) {
      return Promise.resolve(state.routes);
    }
  },

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
      state.error.push(error);
    }
  }
}
