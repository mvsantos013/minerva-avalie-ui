<template>
  <div class="container" style="min-height: 200px">
    <div class="flex items-center pb-8 px-5 lg:px-0">
      <div
        class="text-lg tracking-wide text-center lg:text-left w-full lg:w-auto"
      >
        Disciplinas
      </div>
      <q-space></q-space>
      <div
        class="flex flex-col items-center lg:flex-nowrap lg:flex-row w-full lg:w-auto"
      >
        <q-input
          v-model="searchDiscipline"
          dense
          placeholder="Buscar disciplina"
          class="w-full lg:w-64"
        >
          <template #append>
            <q-icon name="mdi-magnify" />
          </template>
        </q-input>
      </div>
    </div>

    <div
      v-if="
        selectedDepartmentId && !fetchingDisciplines && !fetchingDepartments
      "
    >
      <div v-if="disciplines.length">
        <ul class="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-3">
          <Discipline
            v-for="discipline in items"
            :key="discipline.id"
            :discipline="discipline"
            :loading="fetchingDisciplines || fetchingDepartments"
          />
        </ul>

        <div
          class="flex flex-center pb-10"
          v-if="!(fetchingDisciplines || fetchingDepartments)"
        >
          <q-pagination
            v-model="currentPage"
            :max="numberOfPages"
            :max-pages="6"
            boundary-numbers
            direction-links
            color="primary-300"
          />
        </div>
      </div>
      <div v-else class="py-5 text-center">
        Não há disciplinas cadastrados no departamento escolhido
      </div>
    </div>
    <div v-else>
      <q-linear-progress indeterminate />
    </div>
  </div>
</template>

<script>
import Discipline from '@/components/home/discipline.vue'

export default {
  components: {
    Discipline,
  },
  props: {
    disciplines: {
      type: Array,
      default: () => [],
    },
    fetchingDisciplines: {
      type: Boolean,
      default: false,
    },
    selectedDepartmentId: {
      type: String,
      default: '',
    },
    departments: {
      type: Array,
      default: () => [],
    },
    fetchingDepartments: {
      type: Boolean,
      default: false,
    },
    searchDiscipline: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 16,
    }
  },
  computed: {
    filteredDisciplines() {
      if (!this.disciplines) return []
      if (!this.searchDiscipline) return this.disciplines

      return this.disciplines.filter((discipline) =>
        discipline.name
          .toLowerCase()
          .includes(this.searchDiscipline.toLowerCase()),
      )
    },
    items() {
      // Paginate items
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredDisciplines.slice(start, end)
    },
    numberOfPages() {
      return Math.ceil(this.filteredDisciplines.length / this.itemsPerPage)
    },
  },
}
</script>
