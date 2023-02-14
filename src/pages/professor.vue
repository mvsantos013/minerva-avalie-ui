<template>
  <div>
    <div class="container pt-5 px-3 max-w-4xl mx-auto">
      <q-tabs
        v-model="tab"
        dense
        class="text-gray-600"
        active-color="primary"
        indicator-color="primary"
        align="center"
        narrow-indicator
      >
        <q-tab
          name="overview"
          label="Visão Geral"
          :disable="fetchingProfessor"
          class="w-1/2 lg:w-auto"
        />
        <div class="w-1/2 lg:w-auto">
          <q-tab
            name="statistics"
            label="Estatísticas"
            :disable="fetchingProfessor || hasPrivateStatistics"
            class="w-full"
          />
          <q-tooltip v-if="!fetchingProfessor && hasPrivateStatistics">
            Os dados desta seção são privados. O professor deve autorizar a
            publicação.
          </q-tooltip>
        </div>
      </q-tabs>

      <q-tab-panels v-model="tab" class="bg-transparent" animated>
        <q-tab-panel name="overview">
          <div
            class="flex flex-col lg:flex-row justify-between lg:flex-nowrap mb-3"
          >
            <ProfessorDetails
              :professor="professor"
              :fetchingProfessor="fetchingProfessor"
              class="w-full lg:w-1/2 pr-3"
            />
            <ProfessorRatings
              :professor="professor"
              :fetchingProfessor="fetchingProfessor"
              :ratingProfessor="ratingProfessor"
              class="w-full lg:w-auto lg:ml-3"
              @onRateProfessor="openRatingDialog"
            />
          </div>
          <ProfessorTestimonials
            :professor="professor"
            :testimonials="testimonials"
            :fetchingProfessor="fetchingProfessor"
            :fetchingTestimonials="fetchingTestimonials"
            :submitingTestimonial="submitingTestimonial || fetchingProfessor"
            @onAddTestimonial="addTestimonial"
            @onEditTestimonial="editTestimonial"
            @onDeleteTestimonial="deleteTestimonial"
            @onReportTestimonial="reportTestimonial"
          />
        </q-tab-panel>
        <q-tab-panel name="statistics">
          <ProfessorStatistics
            :professor="professor"
            :testimonials="testimonials"
            :studentsRatings="studentsRatings"
            :fetchingProfessor="fetchingProfessor"
            :fetchingTestimonials="fetchingTestimonials"
            :fetchingStudentsRatings="fetchingStudentsRatings"
            @onMounted="onProfessorStatisticsMounted"
          />
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <q-dialog v-model="ratingDialog.open">
      <ProfessorRatingDialog
        :studentRatings="studentRatings"
        @onSubmitProfessorRating="submitProfessorRating"
      />
    </q-dialog>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'
import api from '@/utils/api/api'
import ProfessorDetails from '@/components/professor/overview/details.vue'
import ProfessorRatings from '@/components/professor/overview/ratings.vue'
import ProfessorTestimonials from '@/components/professor/overview/testimonials.vue'
import ProfessorRatingDialog from '@/components/professor/overview/rating-dialog.vue'
import ProfessorStatistics from '@/components/professor/statistics/statistics.vue'

export default {
  components: {
    ProfessorDetails,
    ProfessorRatings,
    ProfessorTestimonials,
    ProfessorRatingDialog,
    ProfessorStatistics,
  },
  data() {
    return {
      tab: 'overview',
      fetchingProfessor: false,
      deparmentId: null,
      professor: {},
      testimonials: [],
      fetchingTestimonials: false,
      submitingTestimonial: false,
      ratingDialog: {
        open: false,
      },
      ratingProfessor: false,
      studentRatings: {},
      studentsRatings: [],
      fetchingStudentsRatings: false,
    }
  },
  computed: {
    user: get('auth/user'),
    isUserAuthenticated: get('auth/isUserAuthenticated'),
    userHasGroup: get('auth/userHasGroup'),
    hasPrivateStatistics() {
      return (
        Object.keys(this.professor).length > 0 &&
        !this.professor.publicStatistics &&
        !this.userHasGroup('Admin')
      )
    },
  },
  async mounted() {
    const professorId = this.$route.params.id
    this.departmentId = this.$route.query.departmentId

    if (!professorId || !this.departmentId) {
      this.$router.push({ name: 'error-404' })
    }

    await this.fetchProfessor(this.departmentId, professorId)
    if (this.isUserAuthenticated) {
      this.fetchProfessorRatingByStudent(professorId)
    }
    this.fetchTestimonials(this.departmentId, professorId)
  },
  methods: {
    async fetchProfessor(departmentId, professorId) {
      if (this.fetchingProfessor) return
      this.fetchingProfessor = true
      const response = await api.fetchProfessor(departmentId, professorId)
      if (response.ok) this.professor = response.data
      else this.$router.push({ name: 'error-404' })
      this.fetchingProfessor = false
    },
    async fetchTestimonials(departmentId, professorId) {
      if (this.fetchingTestimonials) return
      this.fetchingTestimonials = true
      const response = await api.fetchProfessorTestimonials(
        departmentId,
        professorId,
      )
      if (response.ok)
        this.testimonials = response.data.sort((a, b) => {
          if (a.postedAt > b.postedAt) return -1
          if (a.postedAt < b.postedAt) return 1
          return 0
        })
      this.fetchingTestimonials = false
    },
    async fetchProfessorRatingByStudent(professorId) {
      if (this.ratingProfessor) return
      this.ratingProfessor = true
      const studentId = this.user.id
      const response = await api.fetchProfessorRatingByStudent(
        professorId,
        studentId,
      )
      if (response.ok) this.studentRatings = response.data
      this.ratingProfessor = false
    },
    openRatingDialog() {
      this.ratingDialog.open = true
    },
    async submitProfessorRating(ratings) {
      if (this.ratingProfessor) return
      this.ratingProfessor = true
      this.ratingDialog.open = false
      const professorId = this.$route.params.id
      const studentId = this.user.id
      const response = await api.rateProfessor(
        this.departmentId,
        professorId,
        studentId,
        ratings,
      )
      if (response.ok) {
        this.studentRatings.ratings = JSON.parse(
          JSON.stringify(ratings.ratings),
        )
        this.studentRatings.comments = JSON.parse(
          JSON.stringify(ratings.comments || {}),
        )
        this.$toast.success('Avaliação salva com sucesso.')
        this.fetchProfessor(this.departmentId, professorId)
        this.studentsRatings = []
      }
      this.ratingProfessor = false
    },
    async addTestimonial(testimonial) {
      this.submitingTestimonial = true
      const params = {
        professorId: this.professor.id,
        studentId: this.user.id,
        studentName: this.user.name,
        text: testimonial.text,
        anonymous: testimonial.anonymous,
      }
      const response = await api.addProfessorTestimonial(params)
      if (response.ok) {
        this.testimonials.push(response.data)
        this.$toast.success('Depoimento postado com sucesso.')
      }
      this.submitingTestimonial = false
    },
    async editTestimonial(testimonial) {
      if (this.submitingTestimonial) return
      this.submitingTestimonial = true
      const params = {
        id: testimonial.id,
        professorId: this.professor.id,
        studentId: this.user.id,
        studentName: this.user.name,
        text: testimonial.text,
      }
      const response = await api.updateProfessorTestimonial(params)
      if (response.ok) {
        this.testimonials = this.testimonials.map((t) =>
          t.id === response.data.id ? response.data : t,
        )
        this.$toast.success('Depoimento editado com sucesso.')
      }
      this.submitingTestimonial = false
    },
    async deleteTestimonial(testimonial) {
      if (this.submitingTestimonial) return
      this.submitingTestimonial = true
      const response = await api.deleteProfessorTestimonial(testimonial)
      if (response.ok) {
        this.testimonials = this.testimonials.filter(
          (t) => t.id !== testimonial.id,
        )
        this.$toast.success('Depoimento excluido com sucesso.')
      }
      this.submitingTestimonial = false
    },
    async onProfessorStatisticsMounted() {
      if (this.studentsRatings.length) return
      this.fetchingStudentsRatings = true
      const response = await api.fetchProfessorRatings(
        this.$route.query.departmentId,
        this.professor.id,
      )
      if (response.ok) this.studentsRatings = response.data
      this.fetchingStudentsRatings = false
    },
    async reportTestimonial(testimonial) {
      if (this.submitingTestimonial) return
      this.submitingTestimonial = true
      testimonial.departmentId = this.$route.query.departmentId
      const response = await api.reportProfessorTestimonial(testimonial)
      if (response.ok) {
        this.$toast.success('Depoimento reportado com sucesso.')
      }
      this.submitingTestimonial = false
    },
  },
}
</script>
