<template>
  <q-card :style="`${$q.platform.is.mobile ? '' : 'width: 36rem;'}`">
    <div class="app-title pb-3 bg-primary-400 text-white pl-3 pt-3">
      Avaliar Disciplina/Professor
    </div>

    <q-card-section>
      <q-form
        ref="form"
        autofocus
        @submit.prevent="$emit('onSubmitEvaluation', formResult)"
      >
        <div class="flex md:flex-nowrap items-center justify-center gap-3 mb-5">
          <q-select
            v-model="selectedPeriod"
            :options="periods"
            :loading="fetchingProfessors || fetchingStudentEvaluation"
            :disable="fetchingProfessors || fetchingStudentEvaluation"
            label="Período"
            dense
            filled
            class="w-1/2"
          />

          <q-select
            v-model="selectedProfessor"
            :options="professors"
            option-label="name"
            option-value="id"
            :loading="fetchingProfessors || fetchingStudentEvaluation"
            :disable="fetchingProfessors || fetchingStudentEvaluation"
            label="Professor(a)"
            dense
            filled
            class="w-1/2"
          />
        </div>

        <div
          v-if="
            selectedPeriod &&
            selectedProfessor &&
            !(fetchingProfessors || fetchingStudentEvaluation)
          "
        >
          <div class="tracking-wide mb-3">Sobre a disciplina</div>
          <section
            v-for="rating in disciplineRatings"
            :key="rating.id"
            class="mb-5"
          >
            <div class="flex items-center mb-2">
              <h5
                class="inline-block px-3 bg-primary text-white rounded-md mr-3 leading-relaxed"
              >
                {{ rating.title }}
              </h5>
              <StarRating
                class="h-5 pb-1"
                :rating="rating.value || 0"
                :star-size="24"
                animate
                text-class="invisible"
                @rating-selected="
                  (v) => {
                    rating.value = v
                    checkUnansweredQuestions()
                  }
                "
              />
            </div>
            <div class="mb-1 ml-4 leading-tight" :style="'font-size: 0.85rem'">
              {{ rating.description }}
            </div>
          </section>

          <q-input
            v-model="disciplineTestimonial"
            label="Depoimento geral sobre a disciplina. (opcional)"
            type="textarea"
            filled
            dense
            maxlength="256"
            rows="2"
            class="mb-7"
          />

          <div class="tracking-wide mb-3">Sobre o(a) professor(a)</div>
          <section
            v-for="rating in professorRatings"
            :key="rating.id"
            class="mb-6"
          >
            <div class="flex items-center mb-2">
              <h5
                class="inline-block px-3 bg-primary text-white rounded-md mr-3 leading-relaxed"
              >
                {{ rating.title }}
              </h5>
              <StarRating
                class="h-5 pb-1"
                :rating="rating.value || 0"
                :star-size="24"
                animate
                text-class="invisible"
                @rating-selected="
                  (v) => {
                    rating.value = v
                    checkUnansweredQuestions()
                  }
                "
              />
            </div>
            <div class="mb-1 ml-4 leading-tight" :style="'font-size: 0.85rem'">
              {{ rating.description }}
            </div>
          </section>

          <q-input
            v-model="professorTestimonial"
            label="Depoimento geral sobre o professor. (opcional)"
            type="textarea"
            filled
            dense
            maxlength="256"
            rows="2"
            class="mb-6"
          />

          <q-input
            v-model="comment"
            label="Comentário para avaliações internas, não disponível ao público. (opcional)"
            type="textarea"
            filled
            dense
            maxlength="256"
            rows="2"
            class="mb-3"
          />
        </div>

        <q-card-actions align="right" :style="'padding-right: 0'">
          <div class="inline-block">
            <q-btn
              color="primary"
              type="submit"
              :disable="submitDisabled"
              :loading="loading"
            >
              Salvar
            </q-btn>
            <q-tooltip v-if="submitDisabled">
              É necessário avaliar todas as categorias para salvar.
            </q-tooltip>
          </div>
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import StarRating from 'vue-star-rating'
import api from '@/utils/api/api'

export default {
  components: {
    StarRating,
  },
  props: {
    disciplineId: {
      type: String,
      required: true,
    },
    questions: {
      type: Array,
      default: () => [],
    },
    periods: {
      type: Array,
      default: () => [],
    },
    professors: {
      type: Array,
      default: () => [],
    },
    fetchingProfessors: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedPeriod: null,
      selectedProfessor: null,
      disciplineRatings: [],
      professorRatings: [],
      comment: null,
      disciplineTestimonial: null,
      professorTestimonial: null,
      unansweredQuetions: true,
      fetchingStudentEvaluation: false,
    }
  },
  computed: {
    submitDisabled() {
      return (
        !this.selectedPeriod ||
        !this.selectedProfessor ||
        this.unansweredQuetions ||
        this.loading ||
        this.fetchingStudentEvaluation
      )
    },
    formResult() {
      return {
        selectedPeriod: this.selectedPeriod,
        selectedProfessor: this.selectedProfessor,
        disciplineRatings: {
          questions: this.disciplineRatings.map((question) => ({
            id: question.id,
            value: question.value,
          })),
        },
        professorRatings: {
          comment: this.comment?.trim(),
          questions: this.professorRatings.map((question) => ({
            id: question.id,
            value: question.value,
          })),
        },
        disciplineTestimonial: this.disciplineTestimonial?.trim(),
        professorTestimonial: this.professorTestimonial?.trim(),
      }
    },
  },
  watch: {
    selectedPeriod() {
      this.fetchStudentEvaluation()
    },
    selectedProfessor() {
      this.fetchStudentEvaluation()
    },
  },
  mounted() {
    this.disciplineRatings = this.questions.filter(
      (question) => question.type === 'discipline',
    )
    this.professorRatings = this.questions.filter(
      (question) => question.type === 'professor',
    )
    this.disciplineRatings.sort((a, b) => a.order - b.order)
    this.professorRatings.sort((a, b) => a.order - b.order)
    this.checkUnansweredQuestions()
  },
  methods: {
    checkUnansweredQuestions() {
      this.unansweredQuetions =
        this.disciplineRatings
          .concat(this.professorRatings)
          .filter((rating) => !rating.value).length > 0
    },
    async fetchStudentEvaluation() {
      if (!this.selectedPeriod || !this.selectedProfessor) return
      this.fetchingStudentEvaluation = true
      const response = await api.fetchEvaluation(
        this.disciplineId,
        this.selectedProfessor.id,
        this.selectedPeriod,
      )
      if (response.ok) {
        try {
          this.disciplineTestimonial = response.data.disciplineTestimonial?.text
          this.professorTestimonial = response.data.professorTestimonial?.text
          this.comment = response.data.professorRatings?.ratings?.comment
          this.disciplineRatings.map((rating) => {
            const value =
              response.data.disciplineRatings?.ratings?.questions?.find(
                (q) => q.id === rating.id,
              )?.value
            rating.value = value
          })
          this.professorRatings.map((rating) => {
            const value =
              response.data.professorRatings?.ratings?.questions?.find(
                (q) => q.id === rating.id,
              )?.value
            rating.value = value
          })
          this.checkUnansweredQuestions()
        } catch (err) {
          console.log(err)
        }
      }
      this.fetchingStudentEvaluation = false
    },
  },
}
</script>
