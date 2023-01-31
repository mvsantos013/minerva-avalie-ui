import { apiClient } from '../config.js'

export default {
  async registerLogin() {
    return await apiClient.post('/logs/register/login')
  },
  async fetchFunds() {
    return await apiClient.get('/funds')
  },
  async createFund(item) {
    return await apiClient.post('/funds', item)
  },
  async updateFund(item) {
    return await apiClient.put(`/funds/${item.fund_id}`, item)
  },
  async deleteFund(id) {
    return await apiClient.delete(`/funds/${id}`)
  },
  async fetchB3FilesLogs() {
    return await apiClient.get('/logs/b3/files')
  },
  async fetchB3Files(file) {
    return await apiClient.get(`/b3/files/${file}`)
  },
  async fetchB3File(file, id) {
    return await apiClient.get(`/b3/files/${file}/${id}`)
  },
  async fetchB3FilesErrorsMessages() {
    return await apiClient.get('/b3/files/meta/errors')
  },
  async downloadB3File(file, id) {
    return await apiClient.get(`/b3/files/${file}/${id}/download`)
  },
  async fetchEmpfDefaultInputs(date) {
    return await apiClient.get(`/b3/files/empf/inputs/${date}`)
  },
  async fetchPcfDefaultInputs(fundId) {
    return await apiClient.get(`/pcf/inputs/${fundId}`)
  },
  async generateEmpf(closing_date, opening_date, funds_inputs) {
    return await apiClient.post('/b3/files/empf/generate', {
      closing_date,
      opening_date,
      funds_inputs,
    })
  },
  async publishEmpf(id) {
    return await apiClient.post(`/b3/files/empf/${id}/email/send`)
  },
  async updateEmpf(id, data) {
    return await apiClient.put(`/b3/files/empf/${id}`, { data })
  },
  async uploadEser(inputs) {
    return await apiClient.post('/b3/files/eser/upload', inputs)
  },
  async updateEser(id, data) {
    return await apiClient.put(`/b3/files/eser/${id}`, { data })
  },
  async fetchEmseDefaultInputs(date) {
    return await apiClient.get(`/b3/files/emse/inputs/${date}`)
  },
  async generateEmse(
    reference_date,
    redemption_date,
    funds_balance,
    eese_files,
  ) {
    return await apiClient.post('/b3/files/emse/generate', {
      reference_date,
      redemption_date,
      funds_balance,
      eese_files,
    })
  },
  async updateEmse(id, data) {
    return await apiClient.put(`/b3/files/emse/${id}`, { data })
  },
  async uploadEmse(inputs) {
    return await apiClient.post('/b3/files/emse/upload', inputs)
  },
  async uploadEese(inputs) {
    return await apiClient.post('/b3/files/eese/upload', inputs)
  },
  async uploadEcvf(inputs) {
    return await apiClient.post('/b3/files/ecvf/upload', inputs)
  },
  async uploadEevf(inputs) {
    return await apiClient.post('/b3/files/eevf/upload', inputs)
  },
  async fetchEcvfDefaultInputs(date) {
    return await apiClient.get(`/b3/files/ecvf/inputs/${date}`)
  },
  async generateEcvf(reference_date, funds_ids) {
    return await apiClient.post('/b3/files/ecvf/generate', {
      reference_date,
      funds_ids,
    })
  },
  async updateEcvf(id, data) {
    return await apiClient.put(`/b3/files/ecvf/${id}`, { data })
  },
  async fetchWallets() {
    return await apiClient.get('/wallet')
  },
  async fetchEtpWallets() {
    return await apiClient.get('/wallet/etp')
  },
  async fetchWallet(id) {
    return await apiClient.get(`/wallet/${id}`)
  },
  async fetchEtpWallet(id) {
    return await apiClient.get(`/wallet/etp/${id}`)
  },
  async uploadWallet(inputs) {
    return await apiClient.post('/wallet/upload', inputs, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  async downloadWallet(fund_id, date) {
    return await apiClient.get(`/wallet/${fund_id}/${date}/download`, {
      responseType: 'blob',
      headers: {
        Accept:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    })
  },
  async walletSendSlackNotification(fundId, date) {
    return await apiClient.post(`/wallet/${fundId}/notify/slack`, { date })
  },
  async walletSendAdminNotification(fundId, date) {
    return await apiClient.post(`/wallet/${fundId}/notify/admin`, { date })
  },
  async walletsendConfirmationNotification(fundId, date) {
    return await apiClient.post(`/wallet/${fundId}/notify/confirmation`, {
      date,
    })
  },
  async uploadETPWallet(inputs) {
    return await apiClient.post('/wallet/etp/upload', inputs, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  async fetchPcfs() {
    return await apiClient.get('/pcf')
  },
  async fetchPcf(id) {
    return await apiClient.get(`/pcf/${id}`)
  },
  async fetchLastPcf(fundId) {
    return await apiClient.get(`/pcf/${fundId}/last`)
  },
  async downloadPcf(id) {
    return await apiClient.get(`/pcf/${id}/download`)
  },
  async generatePcf(inputs) {
    return await apiClient.post('/pcf/generate', inputs)
  },
  async validateShares(fund_id, date) {
    return await apiClient.get(`/validate/shares/${fund_id}`, {
      params: { date },
    })
  },
  async validateFundBalance(fund_id, date) {
    return await apiClient.get(`/validate/balance/${fund_id}`, {
      params: { date },
    })
  },
  async fetchAdminCompositionFiles(filetype) {
    return await apiClient.get(`/pcf/admin-files/${filetype}`)
  },
  async uploadAdminCompositionFiles(inputs) {
    return await apiClient.post('/pcf/admin-file/upload', inputs, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  async downloadAdminCompositionFile(fundId, s3_path) {
    return await apiClient.get(
      `/pcf/admin-file/${fundId}/download?s3_path=${s3_path}`,
      {
        responseType: 'blob',
        headers: {
          Accept: 'application/pdf',
        },
      },
    )
  },
  async uploadPcfFile(inputs) {
    return await apiClient.post('/pcf/custom-pcf/upload', inputs, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  async generateCashCreationReport(fundId, date) {
    return await apiClient.post(
      `/pcf/cash-creation-reports/${fundId}/generate`,
      {
        date,
      },
    )
  },
  async downloadCashCreationReport(fundId) {
    return await apiClient.get(
      `/pcf/cash-creation-reports/${fundId}/download`,
      {
        responseType: 'blob',
        headers: {
          Accept:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      },
    )
  },
  async publishPcf(fund_id, id) {
    return await apiClient.post(`/pcf/${id}/publish`, { fund_id })
  },
  async editPcf(id, opening_value) {
    return await apiClient.post(`/pcf/${id}/edit`, { opening_value })
  },
  async sendPcfEmail(id) {
    return await apiClient.post(`/pcf/${id}/send-email`)
  },
  async fetchPasBusinessPartners() {
    return await apiClient.get(`/pas/business-partners`)
  },
  async createPasBusinessPartner(item) {
    return await apiClient.post('/pas/business-partners', item)
  },
  async updatePasBusinessPartner(item) {
    return await apiClient.put(`/pas/business-partners/${item.id}`, item)
  },
  async deletePasBusinessPartner(id) {
    return await apiClient.delete(`/pas/business-partners/${id}`)
  },
  async fetchPasInstruments() {
    return await apiClient.get(`/pas/instruments`)
  },
  async createPasInstrument(item) {
    return await apiClient.post('/pas/instruments', item)
  },
  async updatePasInstrument(item) {
    return await apiClient.put(`/pas/instruments/${item.id}`, item)
  },
  async deletePasInstrument(id) {
    return await apiClient.delete(`/pas/instruments/${id}`)
  },
  async fetchPasInstrumentTypes() {
    return await apiClient.get(`/pas/instrument-types`)
  },
  async fetchPasCalendars() {
    return await apiClient.get(`/pas/calendars`)
  },
  async fetchPasDigitalAssetAccounts() {
    return await apiClient.get(`/pas/digital-asset-accounts`)
  },
  async fetchPasDigitalAssetAccountTypes() {
    return await apiClient.get(`/pas/digital-asset-account-types`)
  },
  async isAddressValid(address) {
    return await apiClient.get(`/pas/address/validation/${address}`)
  },
  async requestToAddAddress(item) {
    return await apiClient.post(`/pas/address`, item)
  },
  async fetchPendingAddresses() {
    return await apiClient.get(`/pas/pending-addresses`)
  },
  async cancelPendingAddresses(id) {
    return await apiClient.delete(`/pas/pending-addresses/${id}`)
  },
  async approvePendingAddress(item) {
    return await apiClient.post(`/pas/pending-addresses`, item)
  },
  async fetchLogs(logType) {
    return await apiClient.get(`/logs/${logType}`)
  },
  async fetchCcr() {
    return await apiClient.get('/pcf/cash-creation-reports')
  },
  async createCcr(item) {
    return await apiClient.post('/pcf/cash-creation-reports', item)
  },
  async updateCcr(item) {
    return await apiClient.put(
      `/pcf/cash-creation-reports/${item.fund_id}`,
      item,
    )
  },
  async deleteCcr(fundId, date) {
    return await apiClient.delete(`/pcf/cash-creation-reports/${fundId}`, {
      data: { date },
    })
  },
  async fetchInoaPricesRoutineInstruments() {
    return await apiClient.get('/price-routine-instruments')
  },
  async createInoaPricesRoutineInstrument(item) {
    return await apiClient.post('/price-routine-instruments', item)
  },
  async deleteInoaPricesRoutineInstrument(id) {
    return await apiClient.delete(`/price-routine-instruments/${id}`)
  },
  async addAddressToCoinfirm(item) {
    return await apiClient.post('/pas/coinfirm-address', item)
  },
  async fetchLastIndexData(index_id) {
    return await apiClient.get(`/marketdata/${index_id}/last`)
  },
}
