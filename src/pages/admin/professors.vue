<template>
  <div class="container mt-5 bg-white rounded-md">
    <div class="flex">
      <div class="flex-grow p-3 pb-10">
        <div class="flex flex-col">
          <CrudTable
            title="Professors"
            entity="Professor"
            cache-key="admin-professors"
            row-key="id"
            selection="none"
            form-size="md"
            dense
            :rows="professors"
            :columns="columns"
            :loading="fetchingProfessors"
            :allow-create="userHasPermission('create:professors')"
            :allow-update="userHasPermission('update:professors')"
            :allow-delete="userHasPermission('delete:professors')"
            :allowSelectionDelete="false"
            :pagination="{
              sortBy: 'id',
              descending: false,
              page: 1,
              rowsPerPage: 30,
            }"
            @onCreate="onAddProfessor"
            @onUpdate="onUpdateProfessor"
            @onDelete="onRemoveProfessor"
          >
            <q-select
              v-model="selectedDepartmentId"
              :options="departments"
              option-label="name"
              option-value="id"
              :emit-value="true"
              :map-options="true"
              :loading="fetchingDepartments"
              :disable="fetchingDepartments"
              label="Departament"
              dense
              class="ml-5"
            />

            <!-- Override default CRUD form -->
            <template #form="{ state, model, validateForm, submited }">
              <ProfessorCrudForm
                :state="state"
                :model="model"
                :columns="columns"
                :validateForm="validateForm"
                :submited="submited"
                :departments="departments"
                :fetchingDepartments="fetchingDepartments"
              />
            </template>
          </CrudTable>
        </div>
      </div>
      <div class="flex-shrink py-3 border-l" style="min-width: 16rem">
        <Menu :items="pages" />
      </div>
    </div>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'
import api from '@/utils/api/api'
import Menu from '@/components/common/menu/base-menu.vue'
import { getPropValue } from '@/utils/utils'
import CrudTable from '@/components/common/table/crud-table/crud-table.vue'
import ProfessorCrudForm from '@/components/admin/professors/professor-crud-form.vue'
import getSidebar from './sidebar.js'

export default {
  components: {
    Menu,
    CrudTable,
    ProfessorCrudForm,
  },
  data() {
    return {
      professors: [],
      fetchingProfessors: false,
      selectedDepartmentId: null,
      departments: [],
      fetchingDepartments: false,
    }
  },
  computed: {
    userHasGroup: get('auth/userHasGroup'),
    userHasPermission: get('auth/userHasPermission'),
    pages() {
      return getSidebar(this.userHasGroup, this.userHasPermission)
    },
    columns() {
      return [
        {
          name: 'id',
          label: 'ID',
          align: 'left',
          field: (row) => row.id,
          format: (val) => `${val}`,
          sortable: true,
          visible: false,
          type: 'string',
          form: {
            visible: 'update|delete',
            editable: '',
            default: null,
            placeholder: null,
            label: 'ID',
            validations: 'required',
            input: 'string',
          },
          headerFilter: {
            show: true,
            defaultFilters: true,
            customFilters: [],
          },
        },
        {
          name: 'departmentId',
          label: 'Department',
          align: 'left',
          field: (row) => row.departmentId,
          format: (val) => getPropValue(val, 'id', 'name', this.departments),
          sortable: true,
          visible: true,
          type: 'string',
          form: {
            visible: 'create|update|delete',
            editable: 'create',
            default: null,
            placeholder: null,
            label: 'Department',
            validations: 'required',
            input: 'select',
            selectOptions: this.departments,
            selectOptionValue: 'id',
            selectOptionLabel: 'name',
            selectOptionEmitValue: true,
            selectClearable: false,
          },
          headerFilter: {
            show: true,
            defaultFilters: true,
            customFilters: [],
          },
        },
        {
          name: 'name',
          label: 'Name',
          align: 'left',
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
          visible: true,
          type: 'string',
          form: {
            visible: 'create|update|delete',
            editable: 'create|update',
            default: null,
            placeholder: null,
            label: 'Name',
            validations: 'required',
            input: 'string',
          },
          headerFilter: {
            show: true,
            defaultFilters: true,
            customFilters: [],
          },
        },
        {
          name: 'description',
          label: 'Description',
          align: 'left',
          field: (row) => row.description,
          format: (val) => `${val}`,
          sortable: true,
          visible: true,
          type: 'string',
          form: {
            visible: 'create|update|delete',
            editable: 'create|update',
            default: null,
            placeholder: null,
            label: 'Description (optional)',
            validations: '',
            input: 'string',
          },
          headerFilter: {
            show: true,
            defaultFilters: true,
            customFilters: [],
          },
        },
        {
          name: 'about',
          label: 'About',
          align: 'left',
          field: (row) => row.about,
          format: (val) => `${val}`,
          sortable: true,
          visible: false,
          type: 'string',
          form: {
            visible: 'create|update|delete',
            editable: 'create|update',
            default: null,
            placeholder: null,
            label: 'About (optional)',
            validations: '',
            input: 'string',
          },
          headerFilter: {
            show: true,
            defaultFilters: true,
            customFilters: [],
          },
        },
        {
          name: 'publicRating',
          label: 'Public Rating',
          align: 'left',
          field: (row) => row.publicRating,
          format: (val) => `${val}`,
          sortable: true,
          visible: true,
          type: 'string',
          form: {
            visible: 'create|update|delete',
            editable: 'create|update',
            default: false,
            placeholder: null,
            label: 'Public Rating',
            validations: '',
            input: 'string',
          },
          headerFilter: {
            show: true,
            defaultFilters: true,
            customFilters: [],
          },
        },
        {
          name: 'publicTestimonials',
          label: 'Public Testimonials',
          align: 'left',
          field: (row) => row.publicTestimonials,
          format: (val) => `${val}`,
          sortable: true,
          visible: true,
          type: 'string',
          form: {
            visible: 'create|update|delete',
            editable: 'create|update',
            default: false,
            placeholder: null,
            label: 'Public Testimonials',
            validations: '',
            input: 'string',
          },
          headerFilter: {
            show: true,
            defaultFilters: true,
            customFilters: [],
          },
        },
        {
          name: 'publicStatistics',
          label: 'Public Statistics',
          align: 'left',
          field: (row) => row.publicStatistics,
          format: (val) => `${val}`,
          sortable: true,
          visible: true,
          type: 'string',
          form: {
            visible: 'create|update|delete',
            editable: 'create|update',
            default: false,
            placeholder: null,
            label: 'Public Statistics',
            validations: '',
            input: 'string',
          },
          headerFilter: {
            show: true,
            defaultFilters: true,
            customFilters: [],
          },
        },
        {
          name: 'pictureUrl',
          label: 'Picture',
          align: 'left',
          field: (row) => row.pictureUrl,
          format: (val) => `${val}`,
          sortable: true,
          visible: false,
          type: 'string',
          form: {
            visible: 'create|update|delete',
            editable: 'create|update',
            default: null,
            placeholder: null,
            label: 'Edit Picture',
            validations: '',
            input: 'string',
          },
          headerFilter: {
            show: true,
            defaultFilters: true,
            customFilters: [],
          },
        },
      ]
    },
  },
  watch: {
    selectedDepartmentId() {
      this.fetchProfessors(this.selectedDepartmentId)
    },
  },
  async mounted() {
    await this.fetchDepartments()
    if (this.departments.length > 0) {
      this.selectedDepartmentId = this.departments[0].id
      this.fetchProfessors(this.selectedDepartmentId)
    }
  },
  methods: {
    async fetchDepartments() {
      this.fetchingDepartments = true
      const response = await api.fetchDepartments()
      if (response.ok) {
        this.departments = response.data
      }
      this.fetchingDepartments = false
    },
    async fetchProfessors(departmentId) {
      this.fetchingProfessors = true
      const response = await api.fetchProfessors(departmentId)
      if (response.ok) {
        this.professors = response.data
      }
      this.fetchingProfessors = false
    },
    async onAddProfessor(item) {
      // Create multipart form data
      const formData = new FormData()
      formData.append('name', item.name)
      formData.append('description', item.description)
      formData.append('about', item.about)
      formData.append('departmentId', item.departmentId)
      formData.append('publicRating', item.publicRating)
      formData.append('publicTestimonials', item.publicTestimonials)
      formData.append('publicStatistics', item.publicStatistics)
      if (item.pictureUrl) formData.append('picture', item.pictureUrl)

      this.fetchingProfessors = true
      const response = await api.addProfessor(formData)
      if (response.ok) {
        this.$toast.open('Professor added sucessfully.')
        this.fetchProfessors(this.selectedDepartmentId)
      }
      this.fetchingProfessors = false
    },
    async onUpdateProfessor(item) {
      // Create multipart form data
      const formData = new FormData()
      formData.append('id', item.id)
      formData.append('name', item.name)
      formData.append('description', item.description)
      formData.append('about', item.about)
      formData.append('departmentId', item.departmentId)
      formData.append('publicRating', item.publicRating)
      formData.append('publicTestimonials', item.publicTestimonials)
      formData.append('publicStatistics', item.publicStatistics)
      if (item.pictureUrl && typeof item.pictureUrl !== 'string')
        formData.append('picture', item.pictureUrl)

      this.fetchingProfessors = true
      const response = await api.updateProfessor(formData)
      if (response.ok) {
        this.$toast.open('Professor updated sucessfully.')
        this.fetchProfessors(this.selectedDepartmentId)
      }
      this.fetchingProfessors = false
    },
    async onRemoveProfessor(item) {
      this.fetchingProfessors = true
      const response = await api.removeProfessor(item.departmentId, item.id)
      if (response.ok) {
        this.$toast.open('Professor removed sucessfully.')
        this.fetchProfessors(this.selectedDepartmentId)
      }
      this.fetchingProfessors = false
    },
  },
}
</script>
