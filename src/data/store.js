
// initial state
const state = {
  routes: [],
  modules: []
}

// getters
const getters = {

}

// actions
const actions = {
  register({commit}, module){
    commit('addModule', module);
  },

  setRoutes({commit}, routes){
    commit('addRoutes', routes);
  }
}

// mutations
const mutations = {
  addRoutes( state, routes) {
    state.routes = state.routes.concat(routes);
  },

  addModule( state, module ){
    state.modules.push(module);
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
