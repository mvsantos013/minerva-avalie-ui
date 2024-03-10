<template>
  <div>
    <div class="text-white bg-green-600 text-center py-2 xl:py-1 px-5">
      Por favor, ajude com seu feedback preenchendo
      <a
        href="https://docs.google.com/forms/d/1Urs3CFxUPTrOdzVsJMJYrq2YA3DAuxwwoLY5HwGl0_A"
        target="_blank"
        class="text-indigo-300 cursor-pointer underline"
      >
        este formulário
      </a>
      após utilizar a aplicação.
    </div>
    <div class="container pt-5 px-3 max-w-3xl mx-auto">
      <div class="flex items-center gap-4 mb-2">
        <h3 class="text-lg font-medium text-center lg:text-left">
          {{ discipline?.name }}
        </h3>
        <div
          v-if="disciplineRatingSummary?.totalAverageValue"
          :style="'margin-top: -3px'"
        >
          <StarRating
            class="h-5"
            :rating="disciplineRatingSummary?.totalAverageValue.toFixed(1) || 0"
            :star-size="18"
            read-only
            :increment="0.01"
            :round-start-rating="false"
            :style="'color: #707070'"
            :text-class="`text-gray-500 mt-1`"
          />
          <q-tooltip>
            <div class="max-w-sm text-center mb-2">
              Avaliação média da disciplina com todos os professores
            </div>
          </q-tooltip>
        </div>
        <q-circular-progress
          v-if="loading"
          indeterminate
          rounded
          size="20px"
          color="primary"
        />
      </div>
      <div v-if="fetchingDiscipline" class="max-w-sm">
        <q-skeleton
          type="text"
          :width="`${Math.floor(Math.random() * 20) + 70}%`"
        />
      </div>

      <div
        class="flex flex-col lg:flex-row justify-between lg:flex-nowrap mb-3"
      >
        <div class="w-full lg:w-1/2 pr-3 mb-3">
          <p :style="'font-size: 0.85rem'">{{ discipline?.description }}</p>
          <div v-if="fetchingDiscipline && !discipline" class="mt-3">
            <q-skeleton type="text" v-for="i in 3" :key="i" />
          </div>
        </div>
        <div class="w-full lg:w-auto lg:ml-3">
          <DisciplineRatings
            :disciplineRatingSummary="disciplineRatingSummary"
            :questions="questions"
            :fetchingQuestions="fetchingQuestions"
            :fetchingDiscipline="fetchingDiscipline"
            :rating="isRating || loading"
            :ratingsCount="disciplineRatingSummary.totalEvaluations"
            :disciplineProfessors="disciplineProfessors"
            @onPostEvaluation="ratingDialog.open = true"
          />
        </div>
      </div>

      <div
        v-if="fetchingDisciplineProfessors || disciplineProfessors.length > 0"
        class="my-5 tracking-wider"
      >
        Docentes
      </div>

      <ul v-if="disciplineProfessors.length > 0" class="mb-16">
        <Paginator :items="disciplineProfessors" :items-per-page="5">
          <template v-slot="item">
            <Professor
              :professor="item"
              :loading="fetchingDisciplineProfessors"
              :no-routing="true"
              :disciplineRating="getDisciplineRatingByProfessor(item.id)"
              :professorRating="getProfessorRatingByDiscipline(item.id)"
              :details="
                professorsRatingsSummary.find((p) => p.professorId === item.id)
              "
              :fetchingProfessorsRatings="fetchingProfessorsRatingsSummary"
              :fetchingDisciplineRatings="fetchingDisciplineRatingsSummary"
              :questions="questions"
              :fetchingQuestions="fetchingQuestions"
              class="shadow-md ml-3 border border-transparent"
              :class="{
                border: selectedProfessor && item.id === selectedProfessor?.id,
                'border-green-200':
                  selectedProfessor && item.id === selectedProfessor?.id,
              }"
            >
            </Professor>
          </template>
        </Paginator>
      </ul>
      <div
        v-if="fetchingDisciplineProfessors && disciplineProfessors.length === 0"
        class="mb-16"
      >
        <q-item
          v-for="i in 2"
          :key="i"
          class="shadow-md rounded-md ml-3 p-3 h-24 mb-5"
        >
          <q-item-section avatar>
            <q-skeleton type="QAvatar" />
          </q-item-section>

          <q-item-section class="max-w-lg">
            <q-item-label>
              <q-skeleton type="text" />
            </q-item-label>
            <q-item-label caption>
              <q-skeleton type="text" />
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>

      <div v-if="disciplineTestimonials.length > 0" class="tracking-wider">
        Comentários gerais sobre esta disciplina
      </div>

      <ul v-if="disciplineTestimonials.length > 0" class="mb-10">
        <Paginator :items="disciplineTestimonials" :items-per-page="5">
          <template v-slot="item">
            <Testimonial
              :testimonial="item"
              :professorName="
                disciplineProfessors.find((p) => p.id === item.professorId)
                  ?.name
              "
              :canEdit="false"
              :canDelete="
                user.id === item.studentId &&
                userHasPermission('post:discipline-testimonial')
              "
              :loading="
                fetchingDisciplineTestimonials ||
                removingDisciplineTestimonial ||
                reportingDisciplineTestimonial
              "
              @onDelete="removeDisciplineTestimonial(item)"
              @onReport="reportDisciplineTestimonial(item)"
              class="flex flex-nowrap items-center w-full rounded-md px-3 py-2 mb-1 ml-2 bg-white shadow-sm"
            />
          </template>
        </Paginator>
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
  </div>
</template>

<script>
import { get } from 'vuex-pathify'
import StarRating from 'vue-star-rating'
import api from '@/utils/api/api'
import Professor from '@/components/common/general/professor.vue'
import Testimonial from '@/components/common/general/testimonial.vue'
import DisciplineRatings from '@/components/discipline/discipline-ratings.vue'
import RatingDialog from '@/components/discipline/rating-dialog.vue'
import Paginator from '@/components/common/general/paginator.vue'

export default {
  components: {
    Professor,
    DisciplineRatings,
    Testimonial,
    StarRating,
    RatingDialog,
    Paginator,
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
      reportingDisciplineTestimonial: false,
      removingDisciplineTestimonial: false,
      loading: false,
    }
  },
  computed: {
    user: get('auth/user'),
    isUserAuthenticated: get('auth/isUserAuthenticated'),
    userHasGroup: get('auth/userHasGroup'),
    userHasPermission: get('auth/userHasPermission'),
    periods: get('general/AVAILABLE_PERIODS'),
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
      let totalEvaluations = 0
      let count = 0
      this.disciplineRatingsSummaryByProfessor.map((ratingItem) => {
        count += 1
        totalAverageValue += ratingItem.averageValue
        ratingItem.details.map((detail) => {
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
        Object.keys(summary).map((key) => {
          summary[key].averageValue /= count
        })
        if (ratingItem.details.length > 0)
          totalEvaluations += ratingItem.details[0].count
      })
      const disciplineRatingSummary = {
        totalAverageValue: totalAverageValue / count,
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
    if (this.isUserAuthenticated)
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
        this.fetchDisciplineTestimonials(this.deparmentId, this.disciplineId)
        this.loading = true
        setTimeout(async () => {
          this.fetchDisciplineRatingsSummary()
          await this.fetchProfessorsRatingsSummaryOfDiscipline()
          this.loading = false
        }, 4000)
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
        this.departmentId,
        this.disciplineId,
      )
      if (response.ok) {
        this.professorsRatingsSummary = response.data
      }
      this.fetchingProfessorsRatingsSummary = false
    },
    async reportDisciplineTestimonial(testimonial) {
      if (this.reportingDisciplineTestimonial) return
      this.reportingDisciplineTestimonial = true
      const response = await api.reportDisciplineTestimonial(testimonial)
      if (response.ok) {
        this.$toast.open('Denúncia feita com sucesso.')
      } else {
        this.$toast.open({
          message: 'Erro ao denunciar comentário.',
          type: 'error',
        })
      }
      this.reportingDisciplineTestimonial = false
    },
    async removeDisciplineTestimonial(testimonial) {
      if (this.removingDisciplineTestimonial) return
      this.removingDisciplineTestimonial = true
      const response = await api.removeDisciplineTestimonial(testimonial)
      if (response.ok) {
        this.disciplineTestimonials = this.disciplineTestimonials.filter(
          (item) =>
            item.professorIdStudentId !==
            `${testimonial.professorId}:${testimonial.studentId}`,
        )
        this.$toast.open('Comentário removido com sucesso.')
      } else {
        this.$toast.open({
          message: 'Erro ao remover comentário.',
          type: 'error',
        })
      }
      this.removingDisciplineTestimonial = false
    },
    getDisciplineRatingByProfessor(professorId) {
      const summary = this.disciplineRatingsSummaryByProfessor.find(
        (item) => item.professorId === professorId,
      )
      return summary?.averageValue || null
    },
    getProfessorRatingByDiscipline(professorId) {
      const summary = this.professorsRatingsSummary.find(
        (item) => item.professorId === professorId,
      )
      return summary?.averageValue || null
    },
  },
}
</script>
