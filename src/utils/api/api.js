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
  addDepartmentsViaCsv(fd) {
    return apiClient.post(`/departments/upload`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
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
  removeDisciplineTestimonial(testimonial) {
    return apiClient.delete(
      `/disciplines/${testimonial.disciplineId}/testimonials/${testimonial.professorId}`,
      { data: testimonial },
    )
  },
  fetchDisciplinesReportedTestimonials() {
    return apiClient.get(`/disciplines/testimonials/reported`)
  },
  reportDisciplineTestimonial(testimonial) {
    return apiClient.post(
      `/disciplines/${testimonial.disciplineId}/testimonials/${testimonial.professorId}/report`,
      testimonial,
    )
  },
  approveReportedDisciplineTestimonial(testimonial) {
    return apiClient.post(
      `/disciplines/${testimonial.disciplineId}/testimonials/reported/${testimonial.professorId}/approve`,
      testimonial,
    )
  },
  removeReportedDisciplineTestimonial(testimonial) {
    return apiClient.delete(
      `/disciplines/${testimonial.disciplineId}/testimonials/reported/${testimonial.professorId}/remove`,
      { data: testimonial },
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
  addDisciplinesViaCsv(fd) {
    return apiClient.post(`/disciplines/upload`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
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

  fetchProfessors() {
    return apiClient.get(`/professors`)
  },
  fetchProfessor(professorId) {
    return apiClient.get(`/professors/${professorId}`)
  },
  addProfessor(professor) {
    return apiClient.post(`/professors`, professor, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  addProfessorsViaCsv(fd) {
    return apiClient.post(`/professors/upload`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  updateProfessor(professor) {
    return apiClient.put(`/professors/${professor.get('id')}`, professor, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  removeProfessor(professorId) {
    return apiClient.delete(`/professors/${professorId}`)
  },

  fetchProfessorTestimonials(departmentId, professorId) {
    return apiClient.get(
      `/professors/${professorId}/testimonials?departmentId=${departmentId}`,
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
  approveReportedProfessorTestimonial(testimonial) {
    return apiClient.post(
      `/professors/${testimonial.professorId}/testimonials/reported/${testimonial.id}/approve`,
      testimonial,
    )
  },
  removeReportedProfessorTestimonial(testimonial) {
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
  fetchProfessorDisciplines(professorId) {
    return apiClient.get(`/professors/${professorId}/disciplines`)
  },
  fetchProfessorsRatingsSummaryOfDiscipline(departmentId, disciplineId) {
    return apiClient.get(
      `/professors/ratings/${departmentId}/${disciplineId}/summary`,
    )
  },
  postEvaluation(body) {
    return apiClient.post(`/disciplines/evaluation`, body)
  },
  fetchEvaluation(disciplineId, professorId, period) {
    return apiClient.get(
      `/disciplines/${disciplineId}/evaluation?professor_id=${professorId}&period=${period}`,
    )
  },

  fetchQuestions() {
    return apiClient.get(`/questions`)
  },
  addQuestion(question) {
    return apiClient.post(`/questions`, question)
  },
  updateQuestion(question) {
    return apiClient.put(`/questions/${question.id}`, question)
  },
  removeQuestion(questionId) {
    return apiClient.delete(`/questions/${questionId}`)
  },

  fetchConfigurations() {
    return apiClient.get(`/configurations`)
  },
  addConfiguration(configuration) {
    return apiClient.post(`/configurations`, configuration)
  },
  updateConfiguration(configuration) {
    return apiClient.put(`/configurations/${configuration.name}`, configuration)
  },
  removeConfiguration(configurationName) {
    return apiClient.delete(`/configurations/${configurationName}`)
  },
}
