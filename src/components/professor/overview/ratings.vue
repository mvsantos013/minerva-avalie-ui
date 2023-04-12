<template>
  <div>
    <div class="mb-5 text-center lg:text-left">
      <div
        class="flex items-center justify-center lg:justify-start mb-3 lg:mb-2"
      >
        <label class="w-52">
          Didática
          <q-icon name="mdi-help-circle-outline" class="text-gray-400">
            <q-tooltip>
              <ul>
                <li>- Clareza de explicações</li>
                <li>- Engajamento dos alunos</li>
                <li>- Adaptabilidade</li>
              </ul>
            </q-tooltip>
          </q-icon>
        </label>
        <div>
          <StarRating
            class="h-5"
            :rating="ratingValue('didactic')"
            :star-size="18"
            read-only
            :increment="0.01"
            :text-class="`text-gray-500 text-xs ${textClass('didactic')}`"
          />
          <q-tooltip v-if="hasPrivateRating">
            Os dados de avaliação deste professor são privados, o professor deve
            autorizar a publicação.
          </q-tooltip>
        </div>
      </div>

      <div
        class="flex items-center justify-center lg:justify-start mb-3 lg:mb-2"
      >
        <label class="w-52">
          Organização
          <q-icon name="mdi-help-circle-outline" class="text-gray-400">
            <q-tooltip>
              <ul>
                <li>- Planejamento do calendário</li>
                <li>- Planejamento das aulas</li>
                <li>- Comunicação clara</li>
                <li>- Transparência</li>
              </ul>
            </q-tooltip>
          </q-icon>
        </label>
        <div>
          <StarRating
            class="h-5"
            :rating="ratingValue('organization')"
            :star-size="18"
            read-only
            :increment="0.01"
            :text-class="`text-gray-500 text-xs ${textClass('organization')}`"
          />
          <q-tooltip v-if="hasPrivateRating">
            Os dados de avaliação deste professor são privados, o professor deve
            autorizar a publicação.
          </q-tooltip>
        </div>
      </div>

      <div
        class="flex items-center justify-center lg:justify-start mb-3 lg:mb-2"
      >
        <label class="w-52">
          Material de Referência
          <q-icon name="mdi-help-circle-outline" class="text-gray-400">
            <q-tooltip>
              <ul>
                <li>- Relevância</li>
                <li>- Clareza</li>
                <li>- Atualidade</li>
                <li>- Completude</li>
              </ul>
            </q-tooltip>
          </q-icon>
        </label>
        <div>
          <StarRating
            class="h-5"
            :rating="ratingValue('materials')"
            :star-size="18"
            read-only
            :increment="0.01"
            :text-class="`text-gray-500 text-xs ${textClass('materials')}`"
          />
          <q-tooltip v-if="hasPrivateRating">
            Os dados de avaliação deste professor são privados, o professor deve
            autorizar a publicação.
          </q-tooltip>
        </div>
      </div>

      <div
        class="flex items-center justify-center lg:justify-start mb-3 lg:mb-2"
      >
        <label class="w-52">
          Relação com os alunos
          <q-icon name="mdi-help-circle-outline" class="text-gray-400">
            <q-tooltip>
              <ul>
                <li>- Respeito</li>
                <li>- Comunicação</li>
                <li>- Empatia</li>
                <li>- Apoio</li>
              </ul>
            </q-tooltip>
          </q-icon>
        </label>
        <div>
          <StarRating
            class="h-5"
            :rating="ratingValue('relationship')"
            :star-size="18"
            read-only
            :increment="0.01"
            :text-class="`text-gray-500 text-xs ${textClass('relationship')}`"
          />
          <q-tooltip v-if="hasPrivateRating">
            Os dados de avaliação deste professor são privados, o professor deve
            autorizar a publicação.
          </q-tooltip>
        </div>
      </div>

      <div
        class="flex items-center justify-center lg:justify-start mb-3 lg:mb-2"
      >
        <label class="w-52">
          Qualidade da avaliação
          <q-icon name="mdi-help-circle-outline" class="text-gray-400">
            <q-tooltip>
              Qualidade da metodologia de avaliação (provas, listas, trabalhos,
              etc.)
              <ul>
                <li>- Relevância</li>
                <li>- Objetividade</li>
                <li>- Clareza</li>
                <li>- Equilíbrio</li>
              </ul>
            </q-tooltip>
          </q-icon>
        </label>
        <div>
          <StarRating
            class="h-5"
            :rating="ratingValue('evaluation')"
            :star-size="18"
            read-only
            :increment="0.01"
            :text-class="`text-gray-500 text-xs ${textClass('evaluation')}`"
          />
          <q-tooltip v-if="hasPrivateRating">
            Os dados de avaliação deste professor são privados, o professor deve
            autorizar a publicação.
          </q-tooltip>
        </div>
      </div>

      <div
        class="flex flex-col lg:flex-row items-center justify-center lg:justify-start mb-3 lg:mb-2"
      >
        <label class="w-52">
          Dificuldade das provas
          <q-icon name="mdi-help-circle-outline" class="text-gray-400">
            <q-tooltip>
              A nota desta categoria não entra no cálculo da nota final do
              professor.

              <ul>
                <li>1 - Muito Fácil</li>
                <li>2 - Fácil</li>
                <li>3 - Justa</li>
                <li>4 - Difícil</li>
                <li>5 - Muito Difícil</li>
              </ul>
            </q-tooltip>
          </q-icon>
        </label>
        <div class="flex items-center">
          <q-linear-progress
            stripe
            size="10px"
            :value="ratingValue('testDifficulty') / 5 || 0"
            :style="'width: 5.3rem;'"
          />
          <span
            :class="`text-gray-500 text-xs ml-3 pb-1 ${textClass(
              'evaluation',
            )}`"
          >
            {{ ratingValue('testDifficulty')?.toFixed(1) }}
          </span>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-center lg:justify-end mb-6 lg:mb-0">
      <span v-if="professor.publicRating" class="text-xs text-gray-400">
        {{ ratingsCount || 0 }}
        {{ ratingsCount === 1 ? 'avaliação' : 'avaliações' }}
      </span>
      <div>
        <q-btn
          color="primary"
          size="sm"
          class="lg:ml-3"
          :disable="
            fetchingProfessor ||
            !userHasPermission('rate:professor') ||
            ratingProfessor
          "
          :loading="ratingProfessor"
          @click="$emit('onRateProfessor')"
        >
          Avaliar
        </q-btn>
        <q-tooltip v-if="!userHasPermission('rate:professor')">
          Você precisa estar conectado e ser um estudante para avaliar um
          professor.
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
    professor: {
      type: Object,
      default: () => ({}),
    },
    fetchingProfessor: {
      type: Boolean,
      default: false,
    },
    ratingProfessor: {
      type: Boolean,
      default: false,
    },
    ratingsSummary: {
      type: Object,
      default: () => ({}),
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    userHasPermission: get('auth/userHasPermission'),
    userHasGroup: get('auth/userHasGroup'),
    hasPrivateRating() {
      return (
        Object.keys(this.professor).length > 0 &&
        !this.professor.publicRating &&
        !this.userHasGroup('Admin')
      )
    },
  },
  methods: {
    ratingValue(rating) {
      return !this.hasPrivateRating ? this.ratingsSummary?.[rating] : null
    },
    textClass(rating) {
      const value =
        !this.hasPrivateRating && this.ratingsCount > 0
          ? this.ratingsSummary?.[rating]
          : null
      return !value ? 'hidden' : ''
    },
  },
}
</script>
