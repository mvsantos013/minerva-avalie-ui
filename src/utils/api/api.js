import { apiClient } from './config.js'

export default {
  async fetchDepartments() {
    return await apiClient.get(`/departments`)
  },
  async fetchDepartment(departmentId) {
    return await apiClient.get(`/departments/${departmentId}`)
  },
  async addDepartment(department) {
    return await apiClient.post(`/departments`, department)
  },
  async updateDepartment(department) {
    return await apiClient.put(`/departments/${department.id}`, department)
  },
  async removeDepartment(departmentId) {
    return await apiClient.delete(`/departments/${departmentId}`)
  },

  async fetchProfessors(departmentId) {
    return await apiClient.get(`/departments/${departmentId}/professors`)
  },
  async fetchProfessor(departmentId, professorId) {
    return await apiClient.get(
      `/departments/${departmentId}/professors/${professorId}`,
    )
  },
  async addProfessor(professor) {
    return await apiClient.post(
      `/departments/${professor.departmentId}/professors`,
      professor,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    )
  },
  async updateProfessor(professor) {
    const departmentId = professor.get('departmentId')
    const professorId = professor.get('id')
    return await apiClient.put(
      `/departments/${departmentId}/professors/${professorId}`,
      professor,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    )
  },
  async removeProfessor(departmentId, professorId) {
    return await apiClient.delete(
      `/departments/${departmentId}/professors/${professorId}`,
    )
  },

  async fetchProfessorTestimonials(professorId) {
    return await apiClient.get(`/professors/${professorId}/testimonials`)
  },
}
