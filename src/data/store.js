
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
    commit('setRoutes', routes);
  }
}

// mutations
const mutations = {
  setRoutes( state, routes) {
    state.routes = routes;
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
