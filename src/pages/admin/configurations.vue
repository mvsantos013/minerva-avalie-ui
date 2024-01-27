<template>
  <div class="container mt-5 bg-white rounded-md">
    <div class="flex">
      <div class="flex-grow p-3 pb-10">
        <div class="flex flex-col">
          <CrudTable
            title="Configurations"
            entity="Configuration"
            cache-key="admin-configurations"
            row-key="id"
            selection="none"
            form-size="md"
            dense
            :rows="configurations"
            :columns="columns"
            :loading="fetchingConfigurations"
            :allow-create="userHasPermission('manage:configurations')"
            :allow-update="userHasPermission('manage:configurations')"
            :allow-delete="userHasPermission('manage:configurations')"
            :allowSelectionDelete="false"
            :pagination="{
              sortBy: 'id',
              descending: false,
              page: 1,
              rowsPerPage: 30,
            }"
            @onCreate="onAddConfiguration"
            @onUpdate="onUpdateConfiguration"
            @onDelete="onRemoveConfiguration"
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
import { get, call } from 'vuex-pathify'
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
      configurations: [],
      fetchingConfigurations: false,
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
            editable: 'create',
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
          name: 'value',
          label: 'Value',
          align: 'left',
          field: (row) => row.value,
          format: (val) => `${val}`,
          sortable: true,
          visible: true,
          type: 'string',
          form: {
            visible: 'create|update|delete',
            editable: 'create|update',
            default: null,
            placeholder: null,
            label: 'Value',
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
  async mounted() {
    this.configurations = await this.fetchConfigurations()
  },
  methods: {
    fetchConfigurations: call('general/fetchConfigurations'),
    async onAddConfiguration(item) {
      this.fetchingConfigurations = true
      const response = await api.addConfiguration(item)
      if (response.ok) {
        this.$toast.open('Configuration added sucessfully.')
        this.configurations = await this.fetchConfigurations()
      }
      this.fetchingConfigurations = false
    },
    async onUpdateConfiguration(item) {
      this.fetchingConfigurations = true
      const response = await api.updateConfiguration(item)
      if (response.ok) {
        this.$toast.open('Configuration updated sucessfully.')
        this.configurations = await this.fetchConfigurations()
      }
      this.fetchingConfigurations = false
    },
    async onRemoveConfiguration(item) {
      this.fetchingConfigurations = true
      const response = await api.removeConfiguration(item.name)
      if (response.ok) {
        this.$toast.open('Configuration removed sucessfully.')
        this.configurations = await this.fetchConfigurations()
      }
      this.fetchingConfigurations = false
    },
  },
}
</script>
