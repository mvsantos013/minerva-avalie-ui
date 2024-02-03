<template>
  <div>
    <div
      v-if="questionsSorted.length > 0"
      class="grid grid-cols-2 gap-2 text-center lg:text-left"
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
            :rating="getRatingValue(question.id)"
            :star-size="18"
            read-only
            :increment="0.01"
            :round-start-rating="false"
            :text-class="`text-gray-500 text-xs mt-1`"
          />
        </div>
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
    ratings: {
      type: Object,
      default: () => ({}),
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
    fetchingProfessor: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    userHasPermission: get('auth/userHasPermission'),
    userHasGroup: get('auth/userHasGroup'),
    questionsSorted() {
      const professorQuestions = this.questions.filter(
        (q) => q.type === 'professor',
      )
      professorQuestions.sort((a, b) => a.order - b.order)
      return professorQuestions
    },
  },
  methods: {
    getRatingValue(questionId) {
      const rating = this.ratings?.details.find(
        (r) => r.questionId === questionId,
      )
      if (!rating) return null
      return parseFloat(rating?.averageValue?.toFixed(1)) || 0
    },
  },
}
</script>
