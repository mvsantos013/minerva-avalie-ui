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

  fetchQuestions() {
    return apiClient.get('/questions')
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

  fetchDisciplines(departmentId) {
    return apiClient.get(`/departments/${departmentId}/disciplines`)
  },
  fetchDiscipline(departmentId, disciplineId) {
    return apiClient.get(
      `/departments/${departmentId}/disciplines/${disciplineId}`,
    )
  },
  fetchDisciplineProfessors(departmentId, disciplineId) {
    return apiClient.get(
      `/departments/${departmentId}/disciplines/${disciplineId}/professors`,
    )
  },
  fetchDisciplineTestimonials(departmentId, disciplineId) {
    return apiClient.get(
      `/departments/${departmentId}/disciplines/${disciplineId}/testimonials`,
    )
  },
  fetchDisciplineRatingsSummary(disciplineId) {
    return apiClient.get(`/disciplines/${disciplineId}/ratings/summary`)
  },
  addDiscipline(discipline) {
    return apiClient.post(
      `/departments/${discipline.departmentId}/disciplines`,
      discipline,
    )
  },
  updateDiscipline(discipline) {
    return apiClient.put(
      `/departments/${discipline.departmentId}/disciplines/${discipline.id}`,
      discipline,
    )
  },
  removeDiscipline(departmentId, disciplineId) {
    return apiClient.delete(
      `/departments/${departmentId}/disciplines/${disciplineId}`,
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
  fetchProfessorsDisciplines() {
    return apiClient.get(
      `/departments/instituto-de-computacao/professors/disciplines`,
    )
  },
  fetchProfessorDisciplines(departmentId, professorId) {
    return apiClient.get(
      `/departments/${departmentId}/professors/${professorId}/disciplines`,
    )
  },
  fetchProfessorsRatingsSummaryOfDiscipline(disciplineId) {
    return apiClient.get(`/professors/ratings/${disciplineId}/summary`)
  },
  postEvaluation(body) {
    return apiClient.post(`/disciplines/evaluation`, body)
  },
  fetchEvaluation(disciplineId, professorId, period) {
    return apiClient.get(
      `/disciplines/${disciplineId}/evaluation?professor_id=${professorId}&period=${period}`,
    )
  },
}
