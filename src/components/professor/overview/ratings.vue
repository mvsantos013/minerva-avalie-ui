<template>
  <div>
    <div class="mb-5">
      <div class="flex items-center mb-2">
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
        <StarRating
          class="h-5"
          :rating="professor?.ratingSummary?.didactic"
          :star-size="18"
          read-only
          :increment="0.01"
          :text-class="`text-gray-500 text-xs ${textClass('didactic')}`"
        />
      </div>

      <div class="flex items-center mb-2">
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
        <StarRating
          class="h-5"
          :rating="professor?.ratingSummary?.organization"
          :star-size="18"
          read-only
          :increment="0.01"
          :text-class="`text-gray-500 text-xs ${textClass('organization')}`"
        />
      </div>

      <div class="flex items-center mb-2">
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
        <StarRating
          class="h-5"
          :rating="professor?.ratingSummary?.materials"
          :star-size="18"
          read-only
          :increment="0.01"
          :text-class="`text-gray-500 text-xs ${textClass('materials')}`"
        />
      </div>

      <div class="flex items-center mb-2">
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
        <StarRating
          class="h-5"
          :rating="professor?.ratingSummary?.relationship"
          :star-size="18"
          read-only
          :increment="0.01"
          :text-class="`text-gray-500 text-xs ${textClass('relationship')}`"
        />
      </div>

      <div class="flex items-center mb-2">
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
        <StarRating
          class="h-5"
          :rating="professor?.ratingSummary?.evaluation"
          :star-size="18"
          read-only
          :increment="0.01"
          :text-class="`text-gray-500 text-xs ${textClass('evaluation')}`"
        />
      </div>

      <div class="flex items-center mb-2">
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
        <q-linear-progress
          stripe
          size="10px"
          :value="professor?.ratingSummary?.testDifficulty / 5 || 0"
          :style="'width: 5.3rem;'"
        />
        <span class="text-gray-500 text-xs ml-3 pb-1">
          {{ professor?.ratingSummary?.testDifficulty }}
        </span>
      </div>
    </div>

    <div class="flex items-center justify-end">
      <span v-if="professor.publicRating" class="text-xs text-gray-400">
        {{ professor?.ratingSummary?.total || 0 }}
        {{ professor?.ratingSummary?.total === 1 ? 'avaliação' : 'avaliações' }}
      </span>
      <div>
        <q-btn
          color="primary"
          size="sm"
          class="ml-3"
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
          professor
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
  },
  computed: {
    userHasPermission: get('auth/userHasPermission'),
  },
  methods: {
    textClass(rating) {
      const value = this.professor?.ratingSummary?.[rating]
      return !value ? 'invisible' : ''
    },
  },
}
</script>
