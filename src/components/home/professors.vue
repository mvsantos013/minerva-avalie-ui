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
              <div class="lg:w-1/12">
                <q-img
                  class="rounded-full mr-4 bg-gray-200 w-16 h-16"
                  :src="
                    professor.pictureUrl
                      ? professor.pictureUrl
                      : 'https://minerva-avalie-bff-files-dev.s3.amazonaws.com/public/imgs/general/profile-empty.png'
                  "
                />
              </div>
              <div
                class="flex flex-col lg:flex-row lg:flex-nowrap lg:w-3/12 text-center lg:text-left lg:pl-3"
              >
                <div class="flex-col">
                  <h3 class="font-medium leading-loose">
                    {{ professor.name }}
                  </h3>
                  <p class="text-xs text-gray-500">
                    {{ professor.description }}
                  </p>
                </div>
              </div>
              <div
                class="lg:w-8/12 ml-3 text-gray-500 text-center lg:text-left"
              >
                <p>{{ professor.about }}</p>
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
      <div class="py-5 text-center">
        Não há professores cadastrados no departamento escolhido
      </div>
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
      itemsPerPage: 10,
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
