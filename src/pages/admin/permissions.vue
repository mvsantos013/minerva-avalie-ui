<template>
  <div class="container mt-5 bg-white rounded-md">
    <div class="flex">
      <div class="flex-grow p-3 pb-10">
        <div class="flex flex-col">
          <CrudTable
            title="Permissions"
            entity="Permission"
            cache-key="admin-permissions"
            row-key="id"
            selection="none"
            form-size="sm"
            dense
            :rows="permissions"
            :columns="columns"
            :loading="loadingPermissions"
            :allow-create="true"
            :allow-update="false"
            :allow-delete="true"
            :allowSelectionDelete="false"
            :showUpdateButton="false"
            @onCreate="createPermission"
            @onDelete="deletePermission"
            :pagination="{
              sortBy: 'id',
              descending: false,
              page: 1,
              rowsPerPage: 15,
            }"
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
import { get, sync, call } from 'vuex-pathify'
import api from '@/utils/api/api'
import Menu from '@/components/common/menu/base-menu.vue'
import CrudTable from '@/components/common/table/crud-table/crud-table.vue'
import getSidebar from './sidebar.js'

export default {
  components: {
    Menu,
    CrudTable,
  },
  computed: {
    permissions: get('auth/permissions'),
    loadingPermissions: sync('auth/loadingPermissions'),
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
            visible: 'create|update|delete',
            editable: 'create',
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
            editable: 'create',
            default: null,
            placeholder: null,
            label: 'Description',
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
  mounted() {
    this.fetchPermissions()
  },
  methods: {
    fetchPermissions: call('auth/fetchPermissions'),
    async createPermission(item) {
      this.loadingPermissions = true
      const response = await api.createPermission(item)
      this.loadingPermissions = false
      if (response.ok) {
        this.$toast.open('Permission created sucessfully.')
        this.fetchPermissions()
      }
    },
    async deletePermission(item) {
      this.loadingPermissions = true
      const response = await api.deletePermission(item.id)
      this.loadingPermissions = false
      if (response.ok) {
        this.$toast.open('Permission deleted sucessfully.')
        this.fetchPermissions()
      }
    },
  },
}
</script>
