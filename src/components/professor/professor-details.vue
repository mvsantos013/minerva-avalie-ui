<template>
  <section class="flex flex-nowrap items-center rounded-md mb-6">
    <div v-if="fetchingProfessor" class="w-full">
      <q-item style="max-width: 50%">
        <q-item-section avatar>
          <q-skeleton type="QAvatar" />
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <q-skeleton type="text" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" width="65%" />
          </q-item-label>
        </q-item-section>
      </q-item>
    </div>
    <div v-else>
      <img class="w-16 h-16 rounded-full mr-4" :src="professor.pictureUrl" />
      <div class="flex-col" :style="'min-width: 12rem'">
        <h3 class="text-lg font-medium">{{ professor.name }}</h3>
        <!-- <p class="text-sm text-gray-600">{{ professor.description }}</p> -->
        <div class="mb-3">
          <div class="inline-block">
            <StarRating
              class="h-5"
              :rating="professor.rating"
              :star-size="18"
              read-only
              :increment="0.01"
              :style="'color: #707070'"
            />
            <q-tooltip>
              <div class="max-w-xs text-center">
                A nota do professor é dada pela média aritmética das demais
                avaliações com exceção da categoria "Dificuldade das provas".
              </div>
            </q-tooltip>
          </div>
        </div>

        <p>
          {{ professor.about }}
        </p>
      </div>
    </div>
  </section>
</template>

<script>
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
  },
}
</script>
