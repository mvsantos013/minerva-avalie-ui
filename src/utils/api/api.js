import { apiClient } from './config.js'

export default {
  fetchGroups() {
    return apiClient.get('/auth/groups')
  },
  createGroup(item) {
    return apiClient.post('/auth/groups', item)
  },
  deleteGroup(id) {
    return apiClient.delete(`/auth/groups/${id}`)
  },
  fetchPermissions() {
    return apiClient.get('/auth/permissions')
  },
  createPermission(item) {
    return apiClient.post('/auth/permissions', item)
  },
  deletePermission(id) {
    return apiClient.delete(`/auth/permissions/${id}`)
  },
  fetchGroupPermissions(id) {
    return apiClient.get(`/auth/groups/${id}/permissions`)
  },
  updateGroupPermissions(id, item) {
    return apiClient.put(`/auth/groups/${id}/permissions`, item)
  },

  fetchDepartments() {
    return apiClient.get(`/departments`)
  },
  fetchDepartment(departmentId) {
    return apiClient.get(`/departments/${departmentId}`)
  },
  addDepartment(department) {
    return apiClient.post(`/departments`, department)
  },
  updateDepartment(department) {
    return apiClient.put(`/departments/${department.id}`, department)
  },
  removeDepartment(departmentId) {
    return apiClient.delete(`/departments/${departmentId}`)
  },

  fetchProfessors(departmentId) {
    return apiClient.get(`/departments/${departmentId}/professors`)
  },
  fetchProfessor(departmentId, professorId) {
    return apiClient.get(
      `/departments/${departmentId}/professors/${professorId}`,
    )
  },
  addProfessor(professor) {
    return apiClient.post(
      `/departments/${professor.departmentId}/professors`,
      professor,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    )
  },
  updateProfessor(professor) {
    const departmentId = professor.get('departmentId')
    const professorId = professor.get('id')
    return apiClient.put(
      `/departments/${departmentId}/professors/${professorId}`,
      professor,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    )
  },
  removeProfessor(departmentId, professorId) {
    return apiClient.delete(
      `/departments/${departmentId}/professors/${professorId}`,
    )
  },

  fetchProfessorTestimonials(departmentId, professorId) {
    return apiClient.get(
      `/professors/${professorId}/testimonials?departmentId=${departmentId}`,
    )
  },
  addProfessorTestimonial(testimonial) {
    return apiClient.post(
      `/professors/${testimonial.professorId}/testimonials`,
      testimonial,
    )
  },
  updateProfessorTestimonial(testimonial) {
    return apiClient.put(
      `/professors/${testimonial.professorId}/testimonials/${testimonial.id}`,
      testimonial,
    )
  },
  deleteProfessorTestimonial(testimonial) {
    return apiClient.delete(
      `/professors/${testimonial.professorId}/testimonials/${testimonial.id}`,
      { data: testimonial },
    )
  },

  fetchProfessorRatings(departmentId, professorId) {
    return apiClient.get(
      `/departments/${departmentId}/professors/${professorId}/ratings`,
    )
  },
  fetchProfessorRatingByStudent(professorId, studentId) {
    return apiClient.get(`/professors/${professorId}/ratings/${studentId}`)
  },
  rateProfessor(departmentId, professorId, studentId, ratings) {
    return apiClient.post(
      `/departments/${departmentId}/professors/${professorId}/ratings/${studentId}`,
      ratings,
    )
  },
}
