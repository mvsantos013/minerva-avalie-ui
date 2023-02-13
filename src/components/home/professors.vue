<template>
  <div v-if="!fetching">
    <div v-if="numberOfPages">
      <ul class="flex flex-col justify-center">
        <li
          class="hovering mb-5 cursor-pointer rounded-md"
          v-for="professor in items"
          :key="professor.id"
        >
          <router-link
            :to="`/professor/${professor.id}?departmentId=${professor.departmentId}`"
          >
            <div
              class="flex flex-col lg:flex-row lg:flex-nowrap items-center bg-white shadow-sm rounded-md p-3"
            >
              <div class="flex-grow">
                <q-img
                  class="w-16 h-16 rounded-full mr-4 bg-gray-200"
                  :src="professor.pictureUrl"
                />
              </div>
              <div
                class="flex flex-col lg:flex-row lg:flex-nowrap text-center lg:text-left"
              >
                <div class="flex-col" :style="profMinWidth">
                  <h3 class="font-medium">{{ professor.name }}</h3>
                  <p class="text-sm text-gray-600">
                    {{ professor.description }}
                  </p>
                </div>
                <div class="flex-grow ml-3 text-gray-500">
                  <p>{{ professor.about }}</p>
                </div>
              </div>
            </div>
          </router-link>
        </li>
      </ul>

      <div class="flex flex-center pb-10">
        <q-pagination
          v-model="currentPage"
          :max="numberOfPages"
          :max-pages="6"
          boundary-numbers
          direction-links
        />
      </div>
    </div>
    <div v-else>
      <div class="py-5 text-center">Nenhum dado disponível</div>
    </div>
  </div>
  <div v-else>
    <div>
      <q-item style="max-width: 85%">
        <q-item-section avatar>
          <q-skeleton type="QAvatar" />
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <q-skeleton type="text" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" width="85%" />
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item style="max-width: 65%">
        <q-item-section avatar>
          <q-skeleton type="QAvatar" />
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <q-skeleton type="text" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" width="90%" />
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item style="max-width: 70%">
        <q-item-section avatar>
          <q-skeleton type="QAvatar" />
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <q-skeleton type="text" width="35%" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" />
          </q-item-label>
        </q-item-section>
      </q-item>
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
    fetching: {
      type: Boolean,
      default: false,
    },
    search: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 6,
    }
  },
  computed: {
    filteredProfessors() {
      if (!this.search) return this.professors

      return this.professors.filter((professor) =>
        professor.name.toLowerCase().includes(this.search.toLowerCase()),
      )
    },
    items() {
      // Paginate items
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredProfessors.slice(start, end)
    },
    numberOfPages() {
      return Math.ceil(this.filteredProfessors.length / this.itemsPerPage)
    },
    profMinWidth() {
      if (this.$q.platform.is.mobile) return ''
      else return 'min-width: 14rem'
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
