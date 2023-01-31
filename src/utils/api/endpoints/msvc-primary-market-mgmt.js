import { apiClient } from '../config.js'

export default {
  async fetchApsGroups() {
    return await apiClient.get('/primary-market-mgmt/groups')
  },
  async fetchApsGroup(groupId) {
    return await apiClient.get(`/primary-market-mgmt/groups/${groupId}`)
  },
  async fetchApsGroupRequest(groupId, reqId) {
    return await apiClient.get(
      `/primary-market-mgmt/groups/${groupId}/requests/${reqId}`,
    )
  },
  async deleteApsGroupRequest(groupId, reqId) {
    return await apiClient.delete(
      `/primary-market-mgmt/groups/${groupId}/requests/${reqId}`,
    )
  },
  async fetchMyGroupData() {
    return await apiClient.get('/primary-market-mgmt/groups/mine')
  },
  async fetchRequests() {
    return await apiClient.get('/primary-market-mgmt/requests')
  },
  async fetchMyGroupRequests() {
    return await apiClient.get('/primary-market-mgmt/groups/mine/requests')
  },
  async fetchMyGroupRequest(id) {
    return await apiClient.get(
      `/primary-market-mgmt/groups/mine/requests/${id}`,
    )
  },
  async createMyGroupRequest(item) {
    return await apiClient.post(
      '/primary-market-mgmt/groups/mine/requests',
      item,
    )
  },
  async updateRequestStatus(item) {
    return await apiClient.put(
      `/primary-market-mgmt/groups/${item.groupId}/requests/${item.requestId}/status`,
      item,
    )
  },
  async updateRequestTransactionsIds(item) {
    return await apiClient.put(
      `/primary-market-mgmt/groups/${item.groupId}/requests/${item.requestId}/transactions-ids`,
      item,
    )
  },
  async fetchCustodiantAddresses() {
    return await apiClient.get('/primary-market-mgmt/custodiant-addresses')
  },
  async createCustodiantAddress(item) {
    return await apiClient.post(
      '/primary-market-mgmt/custodiant-addresses',
      item,
    )
  },
  async updateCustodiantAddress(item) {
    return await apiClient.put(
      `/primary-market-mgmt/custodiant-addresses`,
      item,
    )
  },
  async deleteCustodiantAddress(item) {
    return await apiClient.delete(`/primary-market-mgmt/custodiant-addresses`, {
      data: item,
    })
  },
  async fetchLastIndexData(index_id) {
    return await apiClient.get(`/marketdata/${index_id}/last`)
  },
}
