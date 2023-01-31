import { make } from 'vuex-pathify'
import { Auth } from '@aws-amplify/auth'
import { fromLocalStorage } from '@/utils/utils'
import api from '@/utils/api/api'

const state = {
  user: fromLocalStorage('user', {}),
  userRaw: {},
  userPreferences: fromLocalStorage('userPreferences', {
    displayName: 'name',
    simulatedGroup: null,
  }),
  isUserAuthenticating: true,
  groups: fromLocalStorage('groups', []),
  permissions: fromLocalStorage('permissions', []),
  groupsPermissions: fromLocalStorage('groupsPermissions', []),
  loadingGroups: false,
  loadingPermissions: false,
  loadingGroupsPermissions: false,
  users: fromLocalStorage('users', []),
  loadingUsers: false,
}

const getters = {
  ...make.getters(state),
  isUserAuthenticated: (state) => Object.keys(state.user || {}).length > 0,
  isUserAdmin: (_state, getters) => getters.userGroups.includes('Admin'),
  isUserRealAdmin: (state) => state.user.groups.includes('Admin'),
  userGroups: (state) =>
    state.userPreferences.simulatedGroup
      ? [state.userPreferences.simulatedGroup]
      : state.user.groups || [],
  userRole: (_state, getters) =>
    getters.userGroups.length ? getters.userGroups[0] : '',
  userHasPermission: (state, getters) => (permissions) => {
    const groups = state.groups.filter((group) =>
      getters.userGroups.includes(group.name),
    )
    const userPermissions = groups.reduce(
      (acc, group) => [...acc, ...(group.permissions || [])],
      [],
    )
    const mustHavePermissions = permissions.split('|')
    return mustHavePermissions.some((permission) =>
      userPermissions.includes(permission),
    )
  },
  userHasGroup: (_state, getters) => (groups) => {
    const mustHaveGroups = groups.split('|')
    return mustHaveGroups.some((group) => getters.userGroups.includes(group))
  },
  userHasGroupOfType: (state, getters) => (groupType) => {
    const groupsOfInputedType = state.groups.map((group) => {
      if (group.type === groupType) return group.name
    })
    return getters.userGroups.some((group) =>
      groupsOfInputedType.includes(group),
    )
  },
}

const mutations = {
  ...make.mutations(state),
}

const actions = {
  ...make.actions(state),

  async fetchUsers({ state }) {
    state.loadingUsers = true
    const response = await api.fetchUsers()
    if (response.ok) {
      state.users = response.data
    }
    state.loadingUsers = false
  },
  async fetchUserInfo() {
    try {
      state.isUserAuthenticating = true
      const data = await Auth.currentAuthenticatedUser()
      const userGroupsPermissions = JSON.parse(
        data.signInUserSession.idToken.payload.userData,
      )
      const user = {
        ...data.attributes,
        id: data.attributes.sub,
        name: data.attributes.name || data.username,
        groups: userGroupsPermissions.groups.map((x) => x.name),
        permissions: userGroupsPermissions.permissions,
      }

      state.user = user
      state.userRaw = data
      localStorage.setItem('user', JSON.stringify(state.user))
    } catch (e) {
      state.user = {}
      state.userRaw = {}
      localStorage.removeItem('user')
      if (!window.location.href.includes('/login'))
        window.location.href = '/login'
    } finally {
      state.isUserAuthenticating = false
    }
  },

  async loginWithGoogle({ state }) {
    try {
      state.isUserAuthenticating = true
      Auth.federatedSignIn({ provider: 'Google' })
    } finally {
      state.isUserAuthenticating = false
    }
  },

  async login(_, { username, password }) {
    return Auth.signIn(username, password)
  },

  async confirmNewPassword(_, { user, password }) {
    await Auth.completeNewPassword(user, password, {
      name: user.username,
    })

    window.location.href = '/'
  },

  async logout({ state }) {
    state.isUserAuthenticating = true
    state.user = {}
    state.userRaw = {}
    localStorage.removeItem('user')
    await Auth.signOut()
    window.location.href = '/login'
    setTimeout(() => {
      state.isUserAuthenticating = false
    }, 500)
  },

  async updateUsername({ state }, name) {
    const user = state.userRaw
    await Auth.updateUserAttributes(user, { name })
    state.user = { ...state.user, name }
  },

  async updateUserPreferences({ state }, preferences) {
    const newPreferences = { ...state.userPreferences, ...preferences }
    state.userPreferences = newPreferences
    localStorage.setItem('userPreferences', JSON.stringify(newPreferences))
  },

  async fetchGroups({ state }) {
    if (state.loadingGroups) return
    state.loadingGroups = true
    const response = await api.fetchGroups()
    if (response.ok) {
      state.groups = response.data
      localStorage.setItem('groups', JSON.stringify(state.groups))
    }
    state.loadingGroups = false
  },

  async fetchPermissions({ state }) {
    if (state.loadingPermissions) return
    state.loadingPermissions = true
    const response = await api.fetchPermissions()
    if (response.ok) {
      state.permissions = response.data
      localStorage.setItem('permissions', JSON.stringify(state.permissions))
    }
    state.loadingPermissions = false
  },

  async fetchGroupsPermissions({ state }) {
    if (state.loadingGroupsPermissions) return
    state.loadingGroupsPermissions = true
    const response = await api.fetchGroupsPermissions()
    if (response.ok) {
      state.groupsPermissions = response.data
      localStorage.setItem(
        'groupsPermissions',
        JSON.stringify(state.groupsPermissions),
      )
    }
    state.loadingGroupsPermissions = false
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
