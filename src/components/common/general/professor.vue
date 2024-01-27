<template>
  <div v-if="!loading">
    <li
      class="rounded-md"
      :class="{ 'cursor-pointer': !noRouting, hovering: !noRouting }"
    >
      <router-link
        :to="`/professors/${professor.id}`"
        :is="loading || noRouting ? 'span' : 'router-link'"
      >
        <div
          class="flex flex-col lg:flex-row lg:flex-nowrap items-center gap-5 bg-white shadow-sm rounded-md p-3 hover:bg-gray-300"
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
            <div class="flex flex-col items-center gap-1">
              <StarRating
                class="h-5"
                :rating="disciplineRating / 5"
                :star-size="24"
                read-only
                :max-rating="1"
                :show-rating="false"
              />
              <span
                v-if="disciplineRating"
                class="text-gray-600"
                :style="'font-size: 0.85rem'"
              >
                {{ disciplineRating }}
              </span>
              <q-tooltip v-if="disciplineRating">
                <div class="max-w-sm text-center mb-2">
                  Avaliação média da disciplina com o(a) professor(a)
                </div>
              </q-tooltip>
            </div>
            <div class="border h-10"></div>
            <div class="flex flex-col items-center gap-1">
              <StarRating
                class="h-5"
                :rating="professorRating / 5"
                :star-size="24"
                read-only
                :max-rating="1"
                :show-rating="false"
              />
              <span
                v-if="professorRating"
                class="text-gray-600"
                :style="'font-size: 0.85rem'"
              >
                {{ professorRating }}
              </span>
              <q-tooltip v-if="professorRating">
                <div class="max-w-sm text-center mb-2">
                  Avaliação média do(a) professor(a) nesta disciplina
                </div>
              </q-tooltip>
            </div>
            <q-tooltip v-if="!disciplineRating && !professorRating">
              Este professor ainda não possui avaliações ou suas avaliações não
              são públicas.
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

export default {
  components: {
    StarRating,
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
  },
  data() {
    return {
      defaultPictureUrl:
        'https://minerva-avalie-bff-files-dev.s3.amazonaws.com/public/imgs/general/profile-empty.png',
    }
  },
  computed: {
    isUserAuthenticated: get('auth/isUserAuthenticated'),
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
</style>
