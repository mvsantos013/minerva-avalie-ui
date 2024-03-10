<template>
  <div v-if="!loading">
    <li
      class="bg-white shadow-sm rounded-md"
      :class="{ 'cursor-pointer': !noRouting, hovering: !noRouting }"
    >
      <router-link
        :to="`/professors/${professor.id}`"
        :is="loading || noRouting ? 'span' : 'router-link'"
      >
        <div
          class="flex flex-col lg:flex-row lg:flex-nowrap items-center gap-5 bg-white p-3 hover:bg-gray-300"
          :style="{
            'border-bottom': showProfessorRatings ? 'solid 1px #eee' : 'none',
          }"
        >
          <div class="lg:w-1/12">
            <q-img
              class="rounded-full mr-4 bg-gray-200 w-16 h-16"
              :src="
                professor.pictureUrl ? professor.pictureUrl : defaultPictureUrl
              "
            />
          </div>
          <div
            class="flex flex-col lg:flex-row lg:flex-nowrap lg:w-3/12 text-center lg:text-left"
          >
            <div class="flex-col">
              <h3 class="font-medium leading-tight">
                {{ professor.name }}
              </h3>
              <p class="text-xs text-gray-500">
                {{ professor.description }}
              </p>
            </div>
          </div>
          <div class="lg:w-6/12 text-gray-500 text-center lg:text-left">
            <p>{{ ellipis(professor.about) }}</p>
          </div>
          <div
            v-if="isUserAuthenticated"
            class="lg:w-2/12 flex items-center justify-center gap-2"
          >
            <div class="flex flex-col items-center gap-1 relative">
              <StarRating
                v-if="!fetchingDisciplineRatings"
                class="h-5"
                :rating="
                  professor.hasPublicRating ? disciplineRating / 5 : null
                "
                :star-size="24"
                read-only
                :max-rating="1"
                :show-rating="false"
                :round-start-rating="false"
              />
              <q-circular-progress
                v-else
                indeterminate
                size="xs"
                class="text-primary-400 ml-0.5"
              />
              <span
                v-if="professor.hasPublicRating && disciplineRating !== null"
                class="text-gray-500"
                :style="'font-size: 0.85rem; position: absolute; bottom: -25px; left: 1px'"
              >
                {{ disciplineRating.toFixed(1) }}
              </span>
              <q-tooltip
                v-if="professor.hasPublicRating && disciplineRating !== null"
              >
                <div class="max-w-sm text-center mb-2">
                  Avaliação média da disciplina com o(a) professor(a)
                </div>
              </q-tooltip>
              <q-tooltip v-else-if="!professor.hasPublicRating">
                <div class="max-w-sm text-center mb-2">
                  As avaliações do(a) professor(a) não são públicas.
                </div>
              </q-tooltip>
            </div>
            <div class="border h-10"></div>
            <div class="flex flex-col items-center gap-1 relative">
              <StarRating
                v-if="!fetchingProfessorsRatings"
                class="h-5"
                :rating="details?.studentHasRated ? professorRating / 5 : null"
                :star-size="24"
                read-only
                :max-rating="1"
                :show-rating="false"
              />
              <q-circular-progress
                v-else
                indeterminate
                size="xs"
                class="text-primary-400 ml-0.5"
              />
              <span
                v-if="professorRating !== null && details?.studentHasRated"
                class="text-gray-500"
                :style="'font-size: 0.85rem; position: absolute; bottom: -25px; left: 1px'"
              >
                {{ professorRating.toFixed(1) }}
              </span>
              <q-tooltip
                v-if="
                  professor.hasPublicRating &&
                  professorRating !== null &&
                  details.studentHasRated
                "
              >
                <div class="max-w-sm text-center mb-2">
                  Avaliação média do(a) professor(a) nesta disciplina
                </div>
              </q-tooltip>
              <q-tooltip v-else-if="!professor.hasPublicRating">
                <div class="max-w-sm text-center mb-2">
                  As avaliações do(a) professor(a) não são públicas.
                </div>
              </q-tooltip>
              <q-tooltip
                v-else-if="
                  Object.keys(details) > 0 && !details?.studentHasRated
                "
              >
                <div class="max-w-sm text-center mb-2">
                  É necessário primeiro avaliar o(a) professor(a) para poder ver
                  suas avaliações.
                </div>
              </q-tooltip>
            </div>
            <q-tooltip
              v-if="
                !disciplineRating &&
                !professorRating &&
                professor.hasPublicRating
              "
            >
              Este(a) professor(a) ainda não possui avaliações.
            </q-tooltip>
          </div>
          <div v-else>
            <StarRating
              class="h-5"
              :rating="0"
              :star-size="24"
              read-only
              :max-rating="1"
              :show-rating="false"
            />
            <q-tooltip>
              É necessário estar autenticado para visualizar as avaliações dos
              professores.
            </q-tooltip>
          </div>
        </div>
      </router-link>

      <div
        v-if="showProfessorRatings"
        class="accordion-panel"
        :class="{ active: open }"
      >
        <div class="p-3">
          <div class="text-xs italic text-gray-500 mb-2">
            Avaliações referentes à disciplina
          </div>
          <ProfessorRatings
            :ratings="details"
            :questions="questions"
            :fetchingQuestions="fetchingQuestions"
            :ratingsCount="0"
            :fetchingProfessor="fetchingProfessorsRatings"
          />
        </div>
      </div>
      <div
        v-if="showProfessorRatings"
        class="text-center cursor-pointer hover:bg-gray-50"
        @click="open = !open"
      >
        <q-icon
          name="mdi-chevron-up"
          size="sm"
          class="text-gray-400 transition-transform duration-300 ease-in-out"
          :class="{ 'rotate-180': !open }"
        ></q-icon>
      </div>
    </li>
  </div>
  <q-item v-else class="bg-white h-20 mb-5">
    <q-item-section avatar>
      <q-skeleton type="QAvatar" />
    </q-item-section>

    <q-item-section>
      <q-item-label>
        <q-skeleton type="text" width="450px" />
      </q-item-label>
      <q-item-label caption>
        <q-skeleton type="text" width="250px" />
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { get } from 'vuex-pathify'
import StarRating from 'vue-star-rating'
import ProfessorRatings from '@/components/common/general/professor-ratings.vue'

export default {
  components: {
    StarRating,
    ProfessorRatings,
  },
  props: {
    professor: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
    organizationId: {
      type: String,
      default: '',
    },
    noRouting: {
      type: Boolean,
      default: false,
    },
    disciplineRating: {
      type: String,
      default: '',
    },
    professorRating: {
      type: String,
      default: '',
    },
    fetchingDisciplineRatings: {
      type: Boolean,
      default: false,
    },
    fetchingProfessorsRatings: {
      type: Boolean,
      default: false,
    },
    details: {
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
  },
  data() {
    return {
      open: false,
      defaultPictureUrl:
        'https://minerva-avalie-bff-files-dev.s3.amazonaws.com/public/imgs/general/profile-empty.png',
    }
  },
  computed: {
    isUserAuthenticated: get('auth/isUserAuthenticated'),
    showProfessorRatings() {
      return (
        Object.keys(this.details).length > 0 &&
        this.details?.studentHasRated &&
        !this.fetchingQuestions
      )
    },
  },
  methods: {
    ellipis(text) {
      const threshold = 130
      if (text?.length > threshold) {
        return text.substring(0, threshold) + '...'
      }
      return text
    },
  },
}
</script>

<style lang="postcss" scoped>
.hovering {
  transition: all 0.2s ease-in-out;
  border: solid 2px transparent;

  &:hover {
    border: solid 2px #dadada;
  }
}

.accordion-panel {
  padding: 0 18px;
  background-color: white;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.2s ease-in;

  &.active {
    max-height: 500px;
    overflow-y: auto;
  }
}
</style>
