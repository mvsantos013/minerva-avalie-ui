<template>
  <div>
    <ul class="flex flex-col justify-center">
      <li
        class="hovering mb-8 cursor-pointer rounded-md"
        v-for="professor in professors"
        :key="professor.id"
      >
        <router-link :to="`/professor/${professor.id}`">
          <div
            class="flex flex-nowrap items-center rounded-md p-3"
            :style="'background-color: rgb(248, 248, 248);'"
          >
            <img class="w-16 h-16 rounded-full mr-4" :src="professor.picture" />
            <div class="flex flex-nowrap">
              <div class="flex-col" :style="'min-width: 12rem'">
                <h3 class="text-lg font-medium">{{ professor.name }}</h3>
                <p class="text-sm text-gray-600">{{ professor.description }}</p>
              </div>
              <div class="flex-grow ml-3 text-gray-500">
                <p>{{ professor.about }}</p>
              </div>
              <!-- <StarRating
                class="ml-6 h-5"
                :rating="professor.rating"
                :star-size="16"
              /> -->
            </div>
          </div>
        </router-link>
      </li>
    </ul>

    <div class="flex flex-center pb-10">
      <q-pagination v-model="currentPage" :max="5" direction-links />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    professors: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentPage: 1,
    }
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
