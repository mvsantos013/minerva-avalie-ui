<template>
  <div>
    <div class="container pt-5 px-3 max-w-6xl mx-auto">
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

      <div
        class="flex flex-col lg:flex-row gap-1 lg:gap-0 items-center justify-center mt-3 py-2"
      >
        <q-select
          v-model="selectedPeriods"
          :options="periods"
          :loading="false"
          :disable="false"
          label="Período"
          dense
          filled
          class="w-64"
          multiple
          clearable
        />
        <q-select
          v-model="selectedDisciplines"
          :options="filteredProfessorDisciplines"
          option-label="name"
          option-value="id"
          :emit-value="true"
          :map-options="true"
          :loading="fetchingDisciplines"
          :disable="fetchingDisciplines"
          label="Disciplina"
          dense
          filled
          class="w-64 lg:ml-3"
          multiple
          clearable
        />
      </div>

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
              :ratingsSummary="ratingsSummary"
              :ratingsCount="filteredRatings.length"
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
            :studentsRatings="filteredRatings"
            :ratingCategories="ratingCategories"
            :fetchingProfessor="fetchingProfessor"
            :fetchingTestimonials="fetchingTestimonials"
            :fetchingStudentsRatings="fetchingProfessorRatings"
          />
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <q-dialog v-model="ratingDialog.open">
      <ProfessorRatingDialog
        :periods="periods"
        :disciplines="filteredProfessorDisciplines"
        :fetchingDisciplines="fetchingProfessorDisciplines"
        :periodPlaceholder="ratingDialog.period"
        :disciplinePlaceholder="ratingDialog.disciplineId"
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
      organizationId: null,
      deparmentId: null,
      professor: {},
      testimonials: [],
      fetchingTestimonials: false,
      submitingTestimonial: false,
      ratingDialog: {
        open: false,
      },
      ratingProfessor: false,
      professorDisciplines: [],
      fetchingProfessorDisciplines: false,
      disciplines: [],
      fetchingDisciplines: false,
      professorRatings: [],
      fetchingProfessorRatings: false,
      selectedPeriods: [],
      selectedDisciplines: [],
      ratingCategories: [
        {
          id: 'organization',
          name: 'Organização',
        },
        {
          id: 'didactic',
          name: 'Objetivos de aprendizagem',
        },
        {
          id: 'materials',
          name: 'Materiais de Ref.',
        },
        {
          id: 'relationship',
          name: 'Rel. com os alunos',
        },
        {
          id: 'evaluation',
          name: 'Avaliação',
        },
        {
          id: 'testDifficulty',
          name: 'Dificuldade das provas',
        },
      ],
    }
  },
  computed: {
    user: get('auth/user'),
    isUserAuthenticated: get('auth/isUserAuthenticated'),
    userHasGroup: get('auth/userHasGroup'),
    userHasPermission: get('auth/userHasPermission'),
    hasPrivateStatistics() {
      return (
        Object.keys(this.professor).length > 0 &&
        !this.professor.publicStatistics &&
        !this.userHasGroup('Admin')
      )
    },
    periods() {
      const initialYear = 2022
      const initialSemester = 1
      const currentYear = new Date().getFullYear()
      const currentSemester = new Date().getMonth() < 6 ? 1 : 2
      const periods = []
      for (let year = initialYear; year <= currentYear; year++) {
        for (let semester = initialSemester; semester <= 2; semester++) {
          if (year === currentYear && semester > currentSemester) break
          periods.push(`${year}.${semester}`)
        }
      }
      return periods
    },
    filteredProfessorDisciplines() {
      return this.professorDisciplines.map((d) =>
        this.disciplines.find((di) => di.id === d.disciplineId),
      )
    },
    filteredRatings() {
      // filter professor ratings by selected period and discipline
      if (!this.professorRatings) return []
      // const professorDisciplinesIds = this.professorDisciplines.map(
      //   (pd) => pd.disciplineId,
      // )
      return this.professorRatings.filter((rating) => {
        const hasPeriod =
          !this.selectedPeriods ||
          this.selectedPeriods?.length === 0 ||
          this.selectedPeriods?.includes(rating.period)
        const hasDiscipline =
          !this.selectedDisciplines ||
          this.selectedDisciplines?.length === 0 ||
          this.selectedDisciplines?.includes(rating.disciplineId)
        return hasPeriod && hasDiscipline
      })
    },
    ratingsSummary() {
      const ratingsSummary = Object.fromEntries(
        this.ratingCategories.map((c) => [c.id, 0]),
      )

      if (this.filteredRatings.length === 0) return ratingsSummary

      // sum ratings of each category
      for (let i = 0; i < this.filteredRatings.length; i++) {
        const rating = this.filteredRatings[i]
        this.ratingCategories.forEach((c) => {
          ratingsSummary[c.id] += rating.ratings?.[c.id] || 0
        })
      }

      // take mean
      this.ratingCategories.forEach((c) => {
        ratingsSummary[c.id] =
          ratingsSummary[c.id] / this.filteredRatings.length
      })
      return ratingsSummary
    },
  },
  async mounted() {
    this.professorId = this.$route.params.id
    this.organizationId = this.$route.params.organizationId
    this.departmentId = this.$route.params.departmentId

    if (!this.professorId || !this.departmentId) {
      this.$router.push({ name: 'error-404' })
    }

    this.fetchDisciplines()
    this.fetchProfessor(this.departmentId, this.professorId)
    this.fetchProfessorDisciplines(this.departmentId, this.professorId)
    this.fetchTestimonials(this.departmentId, this.professorId)
    this.fetchProfessorRatings(this.departmentId, this.professorId)

    if (
      this.userHasPermission('rate:professor') &&
      this.$route.query.evaluate === 'true' &&
      this.$route.query.disciplineId &&
      this.$route.query.period
    ) {
      this.ratingDialog.open = true
      this.ratingDialog.disciplineId = this.$route.query.disciplineId
      this.ratingDialog.period = this.$route.query.period
    }
  },
  watch: {
    'ratingDialog.open': function (val) {
      if (val === false && this.$route.query.evaluate === 'true') {
        // Remove query params from url when dialog closes
        this.ratingDialog.disciplineId = null
        this.ratingDialog.period = null
        this.$router.replace({ query: {} })
      }
    },
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
    async fetchDisciplines() {
      if (this.fetchingDisciplines) return
      this.fetchingDisciplines = true
      const response = await api.fetchDisciplines(this.organizationId)
      if (response.ok) this.disciplines = response.data

      this.fetchingDisciplines = false
    },
    async fetchProfessorDisciplines(departmentId, professorId) {
      if (this.fetchingProfessorDisciplines) return
      this.fetchingProfessorDisciplines = true
      const response = await api.fetchProfessorDisciplines(
        departmentId,
        professorId,
      )
      if (response.ok) {
        this.professorDisciplines = response.data
        // // Select a period
        // if (!this.selectedPeriods?.length)
        //   this.selectedPeriods.push('2022.2') &&
        //     this.selectedPeriods.push('2023.1')

        // // Select a discipline
        // if (
        //   !this.selectedDisciplines?.length &&
        //   this.professorDisciplines.length
        // ) {
        //   this.selectedDisciplines.push(
        //     this.professorDisciplines[0].disciplineId,
        //   )
        // }
      }
      this.fetchingProfessorDisciplines = false
    },
    async fetchProfessorRatings(departmentId, professorId) {
      if (this.ratingProfessor) return
      this.ratingProfessor = true
      const response = await api.fetchProfessorRatings(
        departmentId,
        professorId,
      )
      if (response.ok) this.professorRatings = response.data
      this.ratingProfessor = false
    },
    openRatingDialog() {
      this.ratingDialog.open = true
    },
    async submitProfessorRating({ period, disciplineId, comments, ratings }) {
      if (this.ratingProfessor) return
      this.ratingProfessor = true
      this.ratingDialog.open = false
      const professorId = this.$route.params.id
      const studentId = this.user.id

      const response = await api.rateProfessor(
        this.departmentId,
        professorId,
        studentId,
        period,
        disciplineId,
        ratings,
        comments,
      )
      if (response.ok) {
        this.$toast.success('Avaliação salva com sucesso.')
        const studentRating = this.professorRatings.find(
          (r) =>
            r.studentId === this.user.id &&
            r.period === period &&
            r.disciplineId === disciplineId,
        )
        if (studentRating) {
          studentRating.comments = comments
          studentRating.ratings = ratings
        } else {
          this.professorRatings.push(response.data)
        }
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
