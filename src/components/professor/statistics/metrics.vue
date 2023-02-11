<template>
  <div class="flex items-center gap-x-6">
    <q-card
      class="rounded-md py-4 px-2 shadow-md w-36 text-center bg-primary-400 text-white mb-3 lg:mb-0 mx-auto lg:mx-0"
    >
      <div class="text-xs mb-2 whitespace-nowrap">Avaliação média</div>
      <div v-if="!fetchingStudentsRatings" class="text-lg text-bold">
        {{ meanRating | currency('en') }}
      </div>
      <div v-else>
        <q-spinner color="primary" size="24" class="mx-auto"></q-spinner>
      </div>
    </q-card>

    <q-card
      class="rounded-md py-4 px-3 bg-white shadow-md w-36 text-center mb-3 lg:mb-0 mx-auto lg:mx-0"
    >
      <div class="text-xs text-gray-500 mb-2 whitespace-nowrap">
        Qtd. de avaliações
      </div>
      <div v-if="!fetchingStudentsRatings" class="text-lg text-bold">
        {{ qtyStudentsRatings }}
      </div>
      <div v-else>
        <q-spinner color="primary" size="24" class="mx-auto"></q-spinner>
      </div>
    </q-card>

    <q-card
      class="rounded-md py-4 px-3 bg-white shadow-md w-36 text-center mb-3 lg:mb-0 mx-auto lg:mx-0"
    >
      <div class="text-xs text-gray-500 mb-2 whitespace-nowrap">
        Qtd. de depoimentos
      </div>
      <div v-if="!fetchingTestimonials" class="text-lg text-bold">
        {{ qtyTestimonials }}
      </div>
      <div v-else>
        <q-spinner color="primary" size="24" class="mx-auto"></q-spinner>
      </div>
    </q-card>
  </div>
</template>

<script>
export default {
  props: {
    meanRating: {
      type: Number,
      default: 0,
    },
    qtyStudentsRatings: {
      type: Number,
      default: 0,
    },
    qtyTestimonials: {
      type: Number,
      default: 0,
    },
    fetchingStudentsRatings: {
      type: Boolean,
      default: false,
    },
    fetchingTestimonials: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
