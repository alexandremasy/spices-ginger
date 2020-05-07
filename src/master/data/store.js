
// initial state
const state = {
  routes: [],
  modules: [],
  error: []
}

// getters
const getters = {
  getRoutes: state => state.routes
}

// actions
const actions = {
  register({commit}, module){
    commit('addModule', module);
  },

  error({commit}, error){
    commit('addError', error);
  },

  setRoutes({commit}, routes){
    commit('addRoutes', routes);
  },

  getRoutes({ state }){
    return Promise.resolve(state.routes);
  }
}

// mutations
const mutations = {
  addRoutes( state, routes) {
    state.routes = state.routes.concat(routes);
  },

  addModule( state, module ){
    state.modules.push(module);
  },

  addError( state, error ){
    state.error.push(error);
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
