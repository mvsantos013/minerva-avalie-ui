<template>
  <div>
    <div
      v-if="questionsSorted.length > 0"
      class="mb-5 text-center lg:text-left"
    >
      <div
        v-for="question in questionsSorted"
        :key="question.id"
        class="flex items-center justify-center lg:justify-start mb-3 lg:mb-2"
      >
        <label class="w-52 pt-0.5">
          {{ question.title }}
          <q-icon name="mdi-help-circle-outline" class="text-gray-400">
            <q-tooltip>
              <div class="max-w-sm">
                {{ question.description }}
              </div>
            </q-tooltip>
          </q-icon>
        </label>
        <div>
          <StarRating
            class="h-5"
            :rating="
              disciplineRatingSummary?.details[question.id]?.averageValue || 0
            "
            :star-size="18"
            read-only
            :increment="0.01"
            :round-start-rating="false"
            :text-class="`text-gray-500 text-xs mt-1`"
          />
        </div>
      </div>
    </div>

    <div class="flex items-center justify-center lg:justify-end mb-6 lg:mb-0">
      <span
        v-if="!fetchingDiscipline && !fetchingQuestions"
        class="text-xs text-gray-400"
      >
        {{ ratingsCount || 0 }}
        {{ ratingsCount === 1 ? 'avaliação' : 'avaliações' }}
      </span>
      <div>
        <q-btn
          v-if="disciplineProfessors.length > 0"
          color="primary"
          size="sm"
          class="ml-3"
          :disable="
            fetchingDiscipline ||
            fetchingQuestions ||
            !userHasPermission('rate:place-evaluation') ||
            rating
          "
          :loading="fetchingQuestions"
          @click="$emit('onPostEvaluation')"
        >
          Avaliar
        </q-btn>
        <q-tooltip v-if="!userHasPermission('rate:place-evaluation')">
          Você precisa estar conectado e ser um estudante para fazer uma
          avaliação.
        </q-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'
import StarRating from 'vue-star-rating'

export default {
  components: {
    StarRating,
  },
  props: {
    disciplineRatingSummary: {
      type: Object,
      default: () => ({}),
    },
    disciplineProfessors: {
      type: Array,
      default: () => [],
    },
    questions: {
      type: Array,
      default: () => [],
    },
    fetchingQuestions: {
      type: Boolean,
      default: false,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
    fetchingDiscipline: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    userHasPermission: get('auth/userHasPermission'),
    userHasGroup: get('auth/userHasGroup'),
    questionsSorted() {
      const disciplineQuestions = this.questions.filter(
        (q) => q.type === 'discipline',
      )
      disciplineQuestions.sort((a, b) => a.order - b.order)
      return disciplineQuestions
    },
  },
  methods: {},
}
</script>
