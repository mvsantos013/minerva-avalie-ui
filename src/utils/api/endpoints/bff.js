import { apiClient } from '../config.js'

export default {
  async fetchRoutines() {
    return await apiClient.get('/step-functions/hdx-routines')
  },
  async fetchRoutine(arn) {
    return await apiClient.get(`/step-functions/hdx-routines/${arn}`)
  },
  async executeRoutine(arn, inputs) {
    return await apiClient.post(`/step-functions/hdx-routines/${arn}`, inputs)
  },
}
