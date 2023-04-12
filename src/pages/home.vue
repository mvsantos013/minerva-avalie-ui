<template>
  <div>
    <Banner />

    <Organizations
      :selectedOrganizationId="selectedOrganizationId"
      :organizations="organizations"
      :fetchingOrganizations="fetchingOrganizations"
      @onSelect="onSelectOrganization"
      class="pb-20"
    />

    <Professors
      :professors="professors"
      :departments="departments"
      :fetchingProfessors="fetchingProfessors"
      :fetchingDepartments="fetchingDepartments"
      :fetchingOrganizations="fetchingOrganizations"
      :selectedDepartmentId="selectedDepartmentId"
      :selectedOrganizationId="selectedOrganizationId"
      @onSelectDepartment="onSelectDepartment"
    />
  </div>
</template>

<script>
import api from '@/utils/api/api.js'
import Banner from '@/components/home/banner.vue'
import Organizations from '@/components/home/organizations.vue'
import Professors from '@/components/home/professors.vue'

export default {
  components: {
    Banner,
    Organizations,
    Professors,
  },
  data() {
    return {
      selectedOrganizationId: 'ufrj',
      selectedDepartmentId: 'instituto-de-computacao',
      organizations: [{}, {}, {}, {}, {}],
      fetchingOrganizations: false,
      departments: [],
      fetchingDepartments: false,
      professors: [{}, {}, {}, {}, {}],
      fetchingProfessors: false,
    }
  },
  watch: {
    // Fetch professors when department changes
    selectedDepartmentId: function (newDeparmentId, oldDepartmentId) {
      if (newDeparmentId !== oldDepartmentId) {
        this.fetchProfessors(newDeparmentId)
        localStorage.setItem('selectedDepartmentId', newDeparmentId)
      }
    },
  },
  async mounted() {
    await this.fetchOrganizations()
    await this.fetchDepartments(this.selectedOrganizationId)

    const deparmentIdCache = localStorage.getItem('selectedDepartmentId')
    if (deparmentIdCache) {
      // Fetch professors from deparmentId cached
      this.selectedDepartmentId = deparmentIdCache
    } else {
      // Fetch departments and then fetch professors from first department
      this.selectedDepartmentId =
        this.departments.length > 0 ? this.departments[0].id : null
    }

    this.fetchProfessors(this.selectedDepartmentId)
  },
  methods: {
    async fetchOrganizations() {
      if (this.fetchingOrganizations) return
      this.fetchingOrganizations = true
      const response = await api.fetchOrganizations()
      if (response.ok) {
        this.organizations = response.data
      }
      this.fetchingOrganizations = false
    },
    async fetchProfessors(departmentId) {
      if (this.fetchingProfessors) return
      this.fetchingProfessors = true
      const response = await api.fetchProfessors(departmentId)
      if (response.ok) {
        // order by name
        this.professors = response.data.sort((a, b) => {
          if (a.name < b.name) return -1
          if (a.name > b.name) return 1
          return 0
        })
      }
      this.fetchingProfessors = false
    },
    async fetchDepartments(organizationId) {
      if (this.fetchingDepartments) return
      this.fetchingDepartments = true
      const response = await api.fetchDepartments(organizationId)
      if (response.ok) {
        this.departments = response.data
      }
      this.fetchingDepartments = false
    },
    async onSelectOrganization(id) {
      if (id === this.selectedOrganizationId) return
      this.professors = [{}, {}, {}, {}, {}]
      this.departments = []
      this.selectedDepartmentId = ''
      this.selectedOrganizationId = id
      this.fetchDepartments(id)
    },
    async onSelectDepartment(id) {
      if (id === this.selectedDepartmentId) return
      this.selectedDepartmentId = id
    },
  },
}
</script>
