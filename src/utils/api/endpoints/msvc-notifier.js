import { apiClient } from '../config.js'

export default {
  async fetchContacts() {
    return await apiClient.get('/mailing/contacts')
  },
  async fetchContact(type, address) {
    return await apiClient.get(`/mailing/contacts/${type}/${address}`)
  },
  async createContact(address, type, topics) {
    return await apiClient.post(`/mailing/contacts/${type}/${address}`, {
      address,
      type,
      topics,
    })
  },
  async updateContact(type, address, subscribe_topics, unsubscribe_topics) {
    return await apiClient.put(`/mailing/contacts/${type}/${address}`, {
      subscribe_topics,
      unsubscribe_topics,
    })
  },
  async deleteContact(address, type) {
    return await apiClient.delete(`/mailing/contacts/${type}/${address}`)
  },
  async fetchTopics() {
    return await apiClient.get('/mailing/topics')
  },
  async createTopic(id, name, description) {
    return await apiClient.post('/mailing/topics', { id, name, description })
  },
  async deleteTopic(id) {
    return await apiClient.delete(`/mailing/topics/${id}`)
  },
  async fetchSubscriptions() {
    return await apiClient.get('/mailing/subscriptions')
  },
}
