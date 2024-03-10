import { make } from 'vuex-pathify'
import { fromLocalStorage } from '@/utils/utils'
import api from '@/utils/api/api'

const state = {
  fullScreenLoading: false,
  APP_TITLE: fromLocalStorage('APP_TITLE', ''),
  AVAILABLE_PERIODS: fromLocalStorage('user', [], true),
  fetchingConfigurations: false,
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
  async fetchConfigurations({ state }) {
    if (state.fetchingConfigurations) return
    state.fetchingConfigurations = true
    const response = await api.fetchConfigurations()
    if (response.ok) {
      response.data.map((config) => {
        if (config.name === 'APP_TITLE') {
          state.APP_TITLE = config.value
          localStorage.setItem('APP_TITLE', config.value)
        } else if (config.name === 'AVAILABLE_PERIODS') {
          const separator = config.value.includes(';') ? ';' : ','
          state.AVAILABLE_PERIODS = config.value
            .split(separator)
            .filter((p) => p)
          localStorage.setItem(
            'AVAILABLE_PERIODS',
            JSON.stringify(state.AVAILABLE_PERIODS),
          )
        }
      })
    }
    state.fetchingConfigurations = false
    return response.data
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
