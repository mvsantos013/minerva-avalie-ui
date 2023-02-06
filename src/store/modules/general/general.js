import { make } from 'vuex-pathify'

const state = {
  fullScreenLoading: false,
}

const getters = {
  ...make.getters(state),
}

const mutations = {
  ...make.mutations(state),
}

const actions = {
  ...make.actions(state),
  setFullScreenLoading({ state }, value) {
    state.fullScreenLoading = value
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
