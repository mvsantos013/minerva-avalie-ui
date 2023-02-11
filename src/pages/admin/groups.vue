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
            form-size="sm"
            dense
            :rows="groups"
            :columns="columns"
            :loading="loadingGroups"
            :allow-create="true"
            :allow-update="false"
            :allow-delete="true"
            :allowSelectionDelete="false"
            :show-update-button="false"
            :pagination="{
              sortBy: 'id',
              descending: false,
              page: 1,
              rowsPerPage: 30,
            }"
            @onCreate="createGroup"
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
import getSidebar from './sidebar.js'

export default {
  components: {
    Menu,
    CrudTable,
  },

  computed: {
    groups: get('auth/groups'),
    loadingGroups: sync('auth/loadingGroups'),
    userHasGroup: get('auth/userHasGroup'),
    userHasPermission: get('auth/userHasPermission'),
    pages() {
      return getSidebar(this.userHasGroup, this.userHasPermission)
    },
    columns() {
      return [
        {
          name: 'id',
          label: 'Name',
          align: 'left',
          field: (row) => row.id,
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
