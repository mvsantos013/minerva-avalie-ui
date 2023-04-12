<template>
  <div class="container" style="min-height: 500px">
    <div class="flex items-center pb-8 px-5 lg:px-0">
      <div
        class="text-lg tracking-wide text-center lg:text-left w-full lg:w-auto"
      >
        Professores
      </div>
      <q-select
        :value="selectedDepartmentId"
        :options="departments"
        option-label="name"
        option-value="id"
        :emit-value="true"
        :map-options="true"
        :loading="fetchingDepartments"
        :disable="fetchingDepartments"
        label="Departamento"
        dense
        outlined
        class="w-full lg:w-64 lg:ml-6 mb-3 lg:mb-0"
        @input="(id) => $emit('onSelectDepartment', id)"
      />
      <q-space></q-space>
      <div
        class="flex flex-col items-center lg:flex-nowrap lg:flex-row w-full lg:w-auto"
      >
        <q-input
          v-model="searchProfessor"
          dense
          placeholder="Buscar professor"
          class="w-full lg:w-64"
        >
          <template #append>
            <q-icon name="mdi-magnify" />
          </template>
        </q-input>
      </div>
    </div>

    <div v-if="selectedDepartmentId">
      <div v-if="filteredProfessors.length">
        <ul class="grid grid-cols-1 xl:grid-cols-2 gap-3 mb-3">
          <Professor
            v-for="professor in filteredProfessors"
            :key="professor.id"
            :professor="professor"
            :organizationId="selectedOrganizationId"
            :loading="
              fetchingProfessors || fetchingDepartments || fetchingOrganizations
            "
          >
          </Professor>
        </ul>

        <div
          class="flex flex-center pb-10"
          v-if="
            !(
              fetchingProfessors ||
              fetchingDepartments ||
              fetchingOrganizations
            )
          "
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
        Não há professores cadastrados no departamento escolhido
      </div>
    </div>
  </div>
</template>

<script>
import Professor from '@/components/home/professor.vue'

export default {
  components: {
    Professor,
  },
  props: {
    professors: {
      type: Array,
      default: () => [],
    },
    fetchingProfessors: {
      type: Boolean,
      default: false,
    },
    selectedDepartmentId: {
      type: String,
      default: '',
    },
    selectedOrganizationId: {
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
    fetchingOrganizations: {
      type: Boolean,
      default: false,
    },
    searchProfessor: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 12,
    }
  },
  computed: {
    filteredProfessors() {
      if (!this.professors) return []
      if (!this.searchProfessor) return this.professors

      return this.professors.filter((professor) =>
        professor.name
          .toLowerCase()
          .includes(this.searchProfessor.toLowerCase()),
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
