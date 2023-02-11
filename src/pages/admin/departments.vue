<template>
  <div class="container mt-5 bg-white rounded-md">
    <div class="flex">
      <div class="flex-grow p-3 pb-10">
        <div class="flex flex-col">
          <CrudTable
            title="Departments"
            entity="Department"
            cache-key="admin-departments"
            row-key="id"
            selection="none"
            form-size="md"
            dense
            :rows="departments"
            :columns="columns"
            :loading="fetchingDepartments"
            :allow-create="userHasPermission('create:departments')"
            :allow-update="userHasPermission('update:departments')"
            :allow-delete="userHasPermission('delete:departments')"
            :allowSelectionDelete="false"
            :pagination="{
              sortBy: 'id',
              descending: false,
              page: 1,
              rowsPerPage: 30,
            }"
            @onCreate="onAddDepartment"
            @onUpdate="onUpdateDepartment"
            @onDelete="onRemoveDepartment"
          />
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
import CrudTable from '@/components/common/table/crud-table/crud-table.vue'
import getSidebar from './sidebar.js'

export default {
  components: {
    Menu,
    CrudTable,
  },
  data() {
    return {
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
          visible: true,
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
      ]
    },
  },
  async mounted() {
    await this.fetchDepartments()
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
    async onAddDepartment(item) {
      this.fetchingDepartments = true
      const response = await api.addDepartment(item)
      if (response.ok) {
        this.$toast.open('Department added sucessfully.')
        this.fetchDepartments()
      }
      this.fetchingDepartments = false
    },
    async onUpdateDepartment(item) {
      this.fetchingDepartments = true
      const response = await api.updateDepartment(item)
      if (response.ok) {
        this.$toast.open('Department updated sucessfully.')
        this.fetchDepartments()
      }
      this.fetchingDepartments = false
    },
    async onRemoveDepartment(item) {
      this.fetchingDepartments = true
      const response = await api.removeDepartment(item.id)
      if (response.ok) {
        this.$toast.open('Department removed sucessfully.')
        this.fetchDepartments()
      }
      this.fetchingDepartments = false
    },
  },
}
</script>
