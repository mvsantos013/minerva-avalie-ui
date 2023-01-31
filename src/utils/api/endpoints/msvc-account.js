import { apiClient } from '../config.js'

export default {
  fetchUsers() {
    return apiClient.get('/account/users')
  },
  fetchUserGroups(id) {
    return apiClient.get(`/account/users/${id}/groups`)
  },
  updateUserGroups(item) {
    return apiClient.put(`/account/users/${item.id}/groups`, item)
  },
  fetchGroups() {
    return apiClient.get('/account/groups')
  },
  async createGroup(item) {
    return await apiClient.post('/account/groups', item)
  },
  async updateGroup(item) {
    return await apiClient.put(`/account/groups/${item.id}`, item)
  },
  async deleteGroup(id) {
    return await apiClient.delete(`/account/groups/${id}`)
  },
  fetchPermissions() {
    return apiClient.get('/account/permissions')
  },
  async createPermission(item) {
    return await apiClient.post('/account/permissions', item)
  },
  async updatePermission(item) {
    return await apiClient.put(`/account/permissions/${item.id}`, item)
  },
  async deletePermission(id) {
    return await apiClient.delete(`/account/permissions/${id}`)
  },
  fetchGroupPermissions(id) {
    return apiClient.get(`/account/groups/${id}/permissions`)
  },
  updateGroupPermissions(item) {
    return apiClient.put(`/account/groups/${item.id}/permissions`, item)
  },
}
