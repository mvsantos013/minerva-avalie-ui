<template>
  <div>
    <Banner />

    <div class="xl:px-5">
      <q-select
        :value="selectedDepartmentId"
        :options="departments"
        :loading="fetchingDepartments"
        :disable="fetchingDepartments"
        option-value="id"
        option-label="name"
        :map-options="true"
        :emit-value="true"
        label="Departamento selecionado"
        dense
        outlined
        class="w-full lg:w-64 mb-6"
        @input="onSelectDepartment"
      />

      <Disciplines
        :disciplines="disciplines"
        :selectedDepartmentId="selectedDepartmentId"
        :fetchingDisciplines="fetchingDisciplines"
        :fetchingDepartments="fetchingDepartments"
        class="pb-10"
      />
    </div>
  </div>
</template>

<script>
import api from '@/utils/api/api.js'
import Banner from '@/components/home/banner.vue'
import Disciplines from '@/components/home/disciplines.vue'

export default {
  components: {
    Banner,
    Disciplines,
  },
  data() {
    return {
      selectedDepartmentId: 'instituto-de-computacao',
      departments: [],
      fetchingDepartments: false,
      disciplines: [{}, {}, {}, {}, {}],
      fetchingDisciplines: false,
      professors: [{}, {}, {}, {}, {}],
      fetchingProfessors: false,
    }
  },

  async mounted() {
    await this.fetchDepartments()
    await this.fetchDisciplines(this.selectedDepartmentId)

    const deparmentIdCache = localStorage.getItem('selectedDepartmentId')
    if (deparmentIdCache) {
      // Fetch professors from deparmentId cached
      this.selectedDepartmentId = deparmentIdCache
    } else {
      // Fetch departments and then fetch professors from first department
      this.selectedDepartmentId =
        this.departments.length > 0 ? this.departments[0].id : null
    }
  },
  methods: {
    async fetchDepartments() {
      if (this.fetchingDepartments) return
      this.fetchingDepartments = true
      const response = await api.fetchDepartments()
      if (response.ok) {
        this.departments = response.data
      }
      this.fetchingDepartments = false
    },
    async fetchDisciplines(departmentId) {
      if (this.fetchingDisciplines) return
      this.disciplines = []
      this.fetchingDisciplines = true
      const response = await api.fetchDisciplines(departmentId)
      if (response.ok) {
        this.disciplines = response.data
      }
      this.fetchingDisciplines = false
    },
    async onSelectDepartment(id) {
      if (id === this.selectedDepartmentId) return
      this.selectedDepartmentId = id
      localStorage.setItem('selectedDepartmentId', id)
      this.fetchDisciplines(id)
    },
  },
}
</script>
