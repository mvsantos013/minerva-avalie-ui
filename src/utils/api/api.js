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

  fetchOrganizations() {
    return apiClient.get(`/organizations`)
  },
  fetchOrganization(organizationId) {
    return apiClient.get(`/organizations/${organizationId}`)
  },
  addOrganization(organization) {
    return apiClient.post(`/organizations`, organization)
  },
  updateOrganization(organization) {
    return apiClient.put(`/organizations/${organization.id}`, organization)
  },
  removeOrganization(organizationId) {
    return apiClient.delete(`/organizations/${organizationId}`)
  },

  fetchDepartments(organizationId) {
    return apiClient.get(`/org/${organizationId}/departments`)
  },
  fetchDepartment(organizationId, departmentId) {
    return apiClient.get(`/org/${organizationId}/departments/${departmentId}`)
  },
  addDepartment(department) {
    return apiClient.post(
      `/org/${department.organizationId}/departments`,
      department,
    )
  },
  updateDepartment(department) {
    return apiClient.put(
      `/org/${department.organizationId}/departments/${department.id}`,
      department,
    )
  },
  removeDepartment(organizationId, departmentId) {
    return apiClient.delete(
      `/org/${organizationId}/departments/${departmentId}`,
    )
  },

  fetchDisciplines(organizationId) {
    return apiClient.get(`/org/${organizationId}/disciplines`)
  },
  fetchDiscipline(organizationId, disciplineId) {
    return apiClient.get(`/org/${organizationId}/disciplines/${disciplineId}`)
  },
  addDiscipline(discipline) {
    return apiClient.post(
      `/org/${discipline.organizationId}/disciplines`,
      discipline,
    )
  },
  updateDiscipline(discipline) {
    return apiClient.put(
      `/org/${discipline.organizationId}/disciplines/${discipline.id}`,
      discipline,
    )
  },
  removeDiscipline(organizationId, disciplineId) {
    return apiClient.delete(
      `/org/${organizationId}/disciplines/${disciplineId}`,
    )
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
  fetchProfessorsReportedTestimonials() {
    return apiClient.get(`/professors/testimonials/reported`)
  },
  reportProfessorTestimonial(testimonial) {
    return apiClient.post(
      `/professors/${testimonial.professorId}/testimonials/${testimonial.id}/report`,
      testimonial,
    )
  },
  approveReportedTestimonial(testimonial) {
    return apiClient.post(
      `/professors/${testimonial.professorId}/testimonials/reported/${testimonial.id}/approve`,
      testimonial,
    )
  },
  removeReportedTestimonial(testimonial) {
    return apiClient.delete(
      `/professors/${testimonial.professorId}/testimonials/reported/${testimonial.id}/remove`,
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
  fetchProfessorDisciplines(departmentId, professorId) {
    return apiClient.get(
      `/departments/${departmentId}/professors/${professorId}/disciplines`,
    )
  },
  rateProfessor(
    departmentId,
    professorId,
    studentId,
    period,
    disciplineId,
    ratings,
    comments,
  ) {
    return apiClient.post(
      `/departments/${departmentId}/professors/${professorId}/ratings/${studentId}`,
      {
        period,
        disciplineId,
        ratings,
        comments,
      },
    )
  },
}
