<template>
  <div class="container mt-5 bg-white rounded-md">
    <div class="flex">
      <div class="flex-grow p-3 pb-10">
        <div class="flex flex-col">
          <CrudTable
            title="Users"
            entity="User"
            cache-key="admin-users"
            row-key="id"
            selection="none"
            form-size="md"
            dense
            :rows="users"
            :columns="columns"
            :loading="loading || updatingUserGroups"
            :allow-create="false"
            :allow-update="false"
            :allow-delete="false"
            :allowSelectionDelete="false"
            :showCreateButton="false"
            :showUpdateButton="false"
            :showDeleteButton="false"
          >
            <template #actions="{ row }">
              <span>
                <q-btn
                  icon="mdi-shape-outline"
                  flat
                  dense
                  round
                  size="sm"
                  :disable="loadingUserGroups"
                  @click="() => openGroupsDialog(row)"
                />
                <q-tooltip>Manage user groups</q-tooltip>
              </span>
            </template>
          </CrudTable>

          <q-dialog
            v-model="groupsDialog.open"
            transition-show="flip-down"
            transition-hide="flip-up"
          >
            <q-card style="min-width: 40rem">
              <q-card-section class="border">
                <div class="app-title pb-4">{{ groupsDialog.name }} Groups</div>

                <div v-if="loadingUserGroups" class="flex justify-center pb-6">
                  <q-spinner-ball color="primary" size="2em" />
                </div>
                <div v-else>
                  <div class="grid grid-cols-2">
                    <q-checkbox
                      v-for="g in groupsDialog.groups"
                      :key="g.id"
                      v-model="g.checked"
                      :label="g.name"
                      :disable="updatingUserGroups"
                    />
                  </div>
                </div>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="Cancel" color="primary" v-close-popup />
                <q-btn
                  label="Save"
                  color="primary"
                  :loading="loadingUserGroups"
                  :disable="loadingUserGroups || updatingUserGroups"
                  v-close-popup
                  @click="updateUserGroups"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
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
import Sidebar from './sidebar.js'

export default {
  components: {
    Menu,
    CrudTable,
  },
  data() {
    return {
      users: [],
      loading: false,
      loadingUserGroups: false,
      updatingUserGroups: false,
      groupsDialog: {
        open: false,
        id: null,
        name: null,
        groups: [],
      },
    }
  },
  computed: {
    groups: get('auth/groups'),
    pages() {
      return Sidebar
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
            visible: 'create|update|delete',
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
            editable: '',
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
          name: 'email',
          label: 'Email',
          align: 'left',
          field: (row) => row.email,
          format: (val) => `${val}`,
          sortable: true,
          visible: true,
          type: 'string',
          form: {
            visible: 'create|update|delete',
            editable: '',
            default: null,
            placeholder: null,
            label: 'Email',
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
            visible: 'create|update|delete',
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
    this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      try {
        this.loading = true
        const response = await api.fetchUsers()
        if (response.ok) this.users = response.data
      } finally {
        this.loading = false
      }
    },
    async fetchUserGroups(userId) {
      try {
        this.loadingUserGroups = true
        const response = await api.fetchUserGroups(userId)
        if (response.ok) {
          const userGroups = response.data
          this.groupsDialog.groups = this.groups.map((g) => ({
            id: g.id,
            name: g.name,
            checked: userGroups.includes(g.id),
          }))
        }
      } finally {
        this.loadingUserGroups = false
      }
    },
    openGroupsDialog(user) {
      this.fetchUserGroups(user.id)
      this.groupsDialog.id = user.id
      this.groupsDialog.name = user.name
      this.groupsDialog.open = true
    },
    async updateUserGroups() {
      this.updatingUserGroups = true
      const groups = this.groupsDialog.groups
        .filter((g) => g.checked)
        .map((g) => g.id)
      const response = await api.updateUserGroups({
        id: this.groupsDialog.id,
        groups,
      })
      if (response.ok) {
        this.$toast.open('User groups updated sucessfully.')
        this.groupsDialog.open = false
      }
      this.updatingUserGroups = false
    },
  },
}
</script>
