<template>
  <div class="container pt-5 px-3 max-w-3xl mx-auto">
    <div class="flex items-center gap-4 mb-2">
      <h3 class="text-lg font-medium text-center lg:text-left">
        {{ discipline?.name }}
      </h3>
      <div :style="'margin-top: -3px'">
        <StarRating
          class="h-5"
          :rating="disciplineRatingSummary.totalAverageValue || 0"
          :star-size="18"
          read-only
          :increment="0.01"
          :style="'color: #707070'"
          :text-class="`text-gray-500 mt-1`"
        />
        <q-tooltip>
          <div class="max-w-sm text-center mb-2">
            Avaliação média da disciplina
          </div>
        </q-tooltip>
      </div>
    </div>
    <div v-if="fetchingDiscipline" class="max-w-sm">
      <q-skeleton
        type="text"
        :width="`${Math.floor(Math.random() * 20) + 70}%`"
      />
    </div>

    <div class="flex flex-col lg:flex-row justify-between lg:flex-nowrap mb-3">
      <div class="w-full lg:w-1/2 pr-3">
        <p :style="'font-size: 0.85rem'">{{ discipline?.description }}</p>
      </div>
      <div class="w-full lg:w-auto lg:ml-3">
        <DisciplineRatings
          :disciplineRatingSummary="disciplineRatingSummary"
          :questions="questions"
          :fetchingQuestions="fetchingQuestions"
          :fetchingDiscipline="fetchingDiscipline"
          :rating="isRating"
          :ratingsCount="disciplineRatingSummary.totalEvaluations"
          @onPostEvaluation="ratingDialog.open = true"
        />
      </div>
    </div>

    <div class="my-5 tracking-wider">Docentes</div>

    <ul class="mb-16">
      <li
        v-for="professor in disciplineProfessors"
        :key="professor.id"
        class="flex flex-nowrap items-center mb-5"
      >
        <Professor
          :professor="professor"
          :loading="fetchingDisciplineProfessors"
          :no-routing="true"
          class="shadow-md ml-3 border border-transparent"
          :class="{
            border: selectedProfessor && professor.id === selectedProfessor?.id,
            'border-green-200':
              selectedProfessor && professor.id === selectedProfessor?.id,
          }"
        >
        </Professor>
      </li>
    </ul>

    <div class="tracking-wider">Comentários gerais sobre esta disciplina</div>

    <ul class="mb-10">
      <li
        v-for="testimonial in disciplineTestimonials"
        :key="testimonial.id"
        class="flex flex-nowrap items-center mb-5 ml-2"
      >
        <div
          v-for="t in disciplineTestimonials"
          :key="`${t.departmentId}:${t.disciplineId}:${t.createdAt}`"
          class="flex flex-nowrap items-center w-full rounded-md p-3 mb-3 bg-white shadow-sm"
        >
          <Testimonial
            :testimonial="t"
            :canEdit="
              user.id === t.studentId &&
              userHasPermission('post:discipline-testimonial')
            "
            :canDelete="
              user.id === t.studentId &&
              userHasPermission('post:discipline-testimonial')
            "
          />
        </div>
      </li>
    </ul>

    <q-dialog v-model="ratingDialog.open">
      <RatingDialog
        :disciplineId="discipline?.id"
        :questions="questions"
        :periods="periods"
        :professors="disciplineProfessors"
        :fetching-professors="fetchingDisciplineProfessors"
        :loading="isRating"
        @onSubmitEvaluation="submitEvaluation"
      />
    </q-dialog>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'
import api from '@/utils/api/api'
import Professor from '@/components/common/general/professor.vue'
import Testimonial from '@/components/common/general/testimonial.vue'
import DisciplineRatings from '@/components/discipline/discipline-ratings.vue'
import RatingDialog from '@/components/discipline/rating-dialog.vue'
import StarRating from 'vue-star-rating'

export default {
  components: {
    Professor,
    DisciplineRatings,
    Testimonial,
    StarRating,
    RatingDialog,
  },
  data() {
    return {
      selectedPeriod: null,
      selectedProfessor: null,
      discipline: null,
      fetchingDiscipline: false,
      deparmentId: null,
      ratingDialog: {
        open: false,
      },
      evaluating: false,
      disciplineProfessors: [],
      fetchingDisciplineProfessors: false,
      questions: [],
      fetchingQuestions: false,
      disciplineTestimonials: [],
      fetchingDisciplineTestimonials: false,
      isRating: false,
      disciplineRatingsSummaryByProfessor: [],
      professorsRatingsSummary: [],
      fetchingDisciplineRatingsSummary: false,
      fetchingProfessorsRatingsSummary: false,
    }
  },
  computed: {
    user: get('auth/user'),
    isUserAuthenticated: get('auth/isUserAuthenticated'),
    userHasGroup: get('auth/userHasGroup'),
    userHasPermission: get('auth/userHasPermission'),
    periods() {
      const initialYear = 2023
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
    submitDisabled() {
      return (
        !this.selectedPeriod ||
        !this.selectedProfessor ||
        this.fetchingDiscipline ||
        !this.userHasPermission('rate:professor') ||
        this.fetchingDisciplineProfessors
      )
    },
    disciplineRatingSummary() {
      const summary = {}
      let totalAverageValue = 0
      let totalCount = 0
      let totalEvaluations = 0
      this.disciplineRatingsSummaryByProfessor.map((ratingItem) => {
        ratingItem.details.map((detail) => {
          totalAverageValue += detail.averageValue
          totalCount += detail.count
          if (!summary[detail.questionId]) {
            summary[detail.questionId] = {
              questionId: detail.questionId,
              averageValue: detail.averageValue,
              count: detail.count,
            }
          } else {
            summary[detail.questionId].averageValue += detail.averageValue
            summary[detail.questionId].count += detail.count
          }
        })
        if (ratingItem.details.length > 0)
          totalEvaluations += ratingItem.details[0].count
      })
      const disciplineRatingSummary = {
        totalAverageValue: totalAverageValue / totalCount,
        totalCount,
        totalEvaluations,
        details: summary,
      }
      return disciplineRatingSummary
    },
  },
  async mounted() {
    this.departmentId = this.$route.params.departmentId
    this.disciplineId = this.$route.params.disciplineId

    if (!this.disciplineId || !this.departmentId) {
      this.$router.push({ name: 'error-404' })
    }

    this.fetchDiscipline(this.departmentId, this.disciplineId)
    this.fetchDisciplineProfessors(this.departmentId, this.disciplineId)
    this.fetchQuestions()
    this.fetchDisciplineTestimonials(this.deparmentId, this.disciplineId)
    this.fetchDisciplineRatingsSummary()
    this.fetchProfessorsRatingsSummaryOfDiscipline()
  },
  methods: {
    async fetchDiscipline(departmentId, disciplineId) {
      if (this.fetchingDiscipline) return
      this.fetchingDiscipline = true
      const response = await api.fetchDiscipline(departmentId, disciplineId)
      if (response.ok) this.discipline = response.data
      else this.$router.push({ name: 'error-404' })
      this.fetchingDiscipline = false
    },
    async fetchDisciplineProfessors(departmentId, disciplineId) {
      if (this.fetchingDisciplineProfessors) return
      this.fetchingDisciplineProfessors = true
      const response = await api.fetchDisciplineProfessors(
        departmentId,
        disciplineId,
      )
      if (response.ok) {
        this.disciplineProfessors = response.data
      }
      this.fetchingDisciplineProfessors = false
    },
    async fetchQuestions() {
      if (this.fetchingQuestions) return
      this.fetchingQuestions = true
      const response = await api.fetchQuestions()
      if (response.ok) this.questions = response.data
      this.fetchingQuestions = false
    },
    async fetchDisciplineTestimonials(departmentId, disciplineId) {
      if (this.fetchingDisciplineTestimonials) return
      this.fetchingDisciplineTestimonials = true
      const response = await api.fetchDisciplineTestimonials(
        departmentId,
        disciplineId,
      )
      if (response.ok) this.disciplineTestimonials = response.data
      this.fetchingDisciplineTestimonials = false
    },
    async submitEvaluation({
      selectedPeriod,
      selectedProfessor,
      disciplineRatings,
      professorRatings,
      disciplineTestimonial,
      professorTestimonial,
    }) {
      const body = {
        disciplineId: this.disciplineId,
        disciplineDepartmentId: this.departmentId,
        professorId: selectedProfessor.id,
        period: selectedPeriod,
        disciplineRatings,
        professorRatings,
        disciplineTestimonial,
        professorTestimonial,
      }

      if (this.isRating) return
      this.isRating = true
      const response = await api.postEvaluation(body)
      if (response.ok) {
        this.$toast.open('Avaliação feita com sucesso.')
      } else {
        this.$toast.open({
          message: 'Erro ao postar avaliação.',
          type: 'error',
        })
      }
      this.ratingDialog.open = false
      this.isRating = false
    },
    async fetchDisciplineRatingsSummary() {
      if (this.fetchingDisciplineRatingsSummary) return
      this.fetchingDisciplineRatingsSummary = true
      const response = await api.fetchDisciplineRatingsSummary(
        this.disciplineId,
      )
      if (response.ok) {
        this.disciplineRatingsSummaryByProfessor = response.data
      }
      this.fetchingDisciplineRatingsSummary = false
    },
    async fetchProfessorsRatingsSummaryOfDiscipline() {
      if (this.fetchingProfessorsRatingsSummary) return
      this.fetchingProfessorsRatingsSummary = true
      const response = await api.fetchProfessorsRatingsSummaryOfDiscipline(
        this.disciplineId,
      )
      if (response.ok) {
        this.professorsRatingsSummary = response.data
      }
      this.fetchingProfessorsRatingsSummary = false
    },
  },
}
</script>
