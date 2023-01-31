<template>
  <div class="container mt-5 bg-white rounded-md">
    <div class="flex">
      <div class="flex-grow p-3 pb-10">
        <div class="flex flex-col">
          <CrudTable
            title="Groups"
            entity="Group"
            cache-key="admin-group"
            row-key="id"
            selection="none"
            form-size="md"
            dense
            :rows="groups"
            :columns="columns"
            :loading="loadingGroups"
            :allow-create="true"
            :allow-update="true"
            :allow-delete="true"
            :allowSelectionDelete="false"
            :pagination="{
              sortBy: 'id',
              descending: false,
              page: 1,
              rowsPerPage: 30,
            }"
            @onCreate="createGroup"
            @onUpdate="updateGroup"
            @onDelete="deleteGroup"
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
import Menu from '@/components/common/menu/base-menu.vue'
import CrudTable from '@/components/common/table/crud-table/crud-table.vue'
import api from '@/utils/api/api'

export default {
  components: {
    Menu,
    CrudTable,
  },

  computed: {
    groups: get('auth/groups'),
    loadingGroups: sync('auth/loadingGroups'),
    pages() {
      return [
        {
          category: null,
          children: [
            {
              text: 'Users',
              icon: 'mdi-account-group',
              url: '/admin/users',
              visible: true,
            },
            {
              text: 'Groups',
              icon: 'mdi-shape-outline',
              url: '/admin/groups',
              visible: true,
            },
            {
              text: 'Permissions',
              icon: 'mdi-list-status',
              url: '/admin/permissions',
              visible: true,
            },
            {
              text: 'Groups Permissions',
              icon: 'mdi-order-bool-descending',
              url: '/admin/groups/permissions',
              visible: true,
            },
          ],
        },
      ]
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
          name: 'type',
          label: 'Type',
          align: 'left',
          field: (row) => row.type,
          format: (val) => (val ? `${val}` : ''),
          sortable: true,
          visible: true,
          type: 'string',
          form: {
            visible: 'create|update|delete',
            editable: 'create|update',
            default: null,
            placeholder: null,
            label: 'Type',
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
        {
          name: 'updatedAt',
          label: 'Updated At',
          align: 'left',
          field: (row) => row.updatedAt,
          format: (val) =>
            this.$options.filters.date(val, 'YYYY-MM-DD HH:mm:ss', null, -180),
          sortable: true,
          visible: true,
          type: 'string',
          form: {
            visible: 'update|delete',
            editable: '',
            default: null,
            placeholder: null,
            label: 'Updated At',
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
          name: 'createdAt',
          label: 'Created At',
          align: 'left',
          field: (row) => row.createdAt,
          format: (val) =>
            this.$options.filters.date(val, 'YYYY-MM-DD HH:mm:ss', null, -180),
          sortable: true,
          visible: true,
          type: 'string',
          form: {
            visible: 'update|delete',
            editable: '',
            default: null,
            placeholder: null,
            label: 'Created At',
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
    this.fetchGroups()
  },
  methods: {
    fetchGroups: call('auth/fetchGroups'),
    async createGroup(item) {
      this.loadingGroups = true
      const response = await api.createGroup(item)
      this.loadingGroups = false
      if (response.ok) {
        this.$toast.open('Group created sucessfully.')
        this.fetchGroups()
      }
    },
    async updateGroup(item) {
      this.loadingGroups = true
      const response = await api.updateGroup(item)
      this.loadingGroups = false
      if (response.ok) {
        this.$toast.open('Group updated sucessfully.')
        this.fetchGroups()
      }
    },
    async deleteGroup(item) {
      this.loadingGroups = true
      const response = await api.deleteGroup(item.id)
      this.loadingGroups = false
      if (response.ok) {
        this.$toast.open('Group deleted sucessfully.')
        this.fetchGroups()
      }
    },
  },
}
</script>
