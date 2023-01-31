import { apiClient } from '../config.js'

export default {
  async fetchOrders() {
    return await apiClient.get(`/auction-trading/orders`)
  },
  async fetchOrder(item) {
    return await apiClient.get(
      `/auction-trading/orders/${item.auctionType}:${item.id}`,
    )
  },
  async createOrder(item) {
    return await apiClient.post(`/auction-trading/orders`, item)
  },
  async updateOrder(item) {
    return await apiClient.put(
      `/auction-trading/orders/${item.auctionType}:${item.id}`,
      item,
    )
  },
  async deleteOrder(item) {
    return await apiClient.delete(
      `/auction-trading/orders/${item.auctionType}:${item.id}`,
    )
  },
  async fetchOrderLogs(id) {
    return await apiClient.get(`/auction-trading/orders/${id}/logs`)
  },
  async fetchFundsCounterparties() {
    return await apiClient.get('/auction-trading/funds-counterparties')
  },
  async createFundCounterparty(item) {
    return await apiClient.post(`/auction-trading/funds-counterparties`, item)
  },
  async updateFundCounterparty(item) {
    return await apiClient.put(
      `/auction-trading/funds-counterparties/${item.fundId}:${item.counterpartyId}`,
      item,
    )
  },
  async deleteFundCounterparty(fundId, counterpartyId) {
    return await apiClient.delete(
      `/auction-trading/funds-counterparties/${fundId}:${counterpartyId}`,
    )
  },
}
