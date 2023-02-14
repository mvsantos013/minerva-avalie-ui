<template>
  <section class="flex flex-nowrap items-center rounded-md mb-6">
    <div
      v-if="fetchingProfessor && Object.keys(professor).length === 0"
      class="w-full"
    >
      <q-skeleton type="QAvatar" class="mb-3" />
      <q-skeleton type="text" width="40%" />
      <q-skeleton type="text" width="55%" class="mb-3" />
      <q-skeleton type="rect" width="70%" class="h-12" />
    </div>
    <div v-else>
      <img
        class="w-16 h-16 rounded-full mx-auto lg:mr-4 lg:mx-0"
        :src="
          professor.pictureUrl
            ? professor.pictureUrl
            : 'https://minerva-avalie-bff-files-dev.s3.amazonaws.com/public/imgs/general/profile-empty.png'
        "
      />
      <div class="flex-col" :style="'min-width: 12rem'">
        <h3 class="text-lg font-medium mb-2 text-center lg:text-left">
          {{ professor.name }}
        </h3>
        <p
          v-if="professor.description"
          class="text-sm text-gray-600 text-center lg:text-left mb-2 lg:mb-3"
        >
          {{ professor.description }}
        </p>
        <div v-if="false" class="mb-3">
          <div class="inline-block">
            <StarRating
              class="h-5"
              :rating="rating"
              :star-size="18"
              read-only
              :increment="0.01"
              :style="'color: #707070'"
              :text-class="`${!rating ? 'invisible' : ''}`"
            />
            <q-tooltip>
              <div class="max-w-sm text-center mb-2">
                A nota do professor é dada pela média aritmética das demais
                avaliações com exceção da categoria "Dificuldade das provas".
              </div>
              <div class="max-w-sm text-center">
                Este dado é privado por padrão, o professor deve autorizar a
                publicação.
              </div>
            </q-tooltip>
          </div>
        </div>

        <p class="text-center lg:text-left">
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
  computed: {
    rating() {
      const r = this.professor?.ratingSummary
      if (!r) return null
      return (
        (r.didactic +
          r.organization +
          r.materials +
          r.relationship +
          r.evaluation) /
        5
      )
    },
  },
}
</script>
