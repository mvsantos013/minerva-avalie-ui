<template>
  <div class="container mt-5 bg-white rounded-md">
    <div class="flex flex-nowrap">
      <div class="flex-grow p-6 pb-10">
        <div class="flex flex-col">
          <div class="app-title mt-1">Groups Permissions</div>
          <q-select
            v-model="selectedGroup"
            ref="groupsSelect"
            :options="groups"
            label="Group"
            option-value="id"
            option-label="name"
            :loading="loadingGroupPermissions"
            :disable="loadingGroupPermissions || updatingGroupPermissions"
            :rules="getRules('required')"
            :clearable="false"
            :dense="false"
            class="max-w-xs"
          />
          <div v-if="groupPermissions">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <q-checkbox
                v-for="g in groupPermissions"
                :key="g.id"
                v-model="g.checked"
                :label="g.id"
                :disable="loadingGroupPermissions || updatingGroupPermissions"
                class="whitespace-nowrap"
              />
            </div>
            <div class="text-right mt-5">
              <q-btn
                label="Save"
                color="primary"
                :loading="updatingGroupPermissions"
                :disable="loadingGroupPermissions || updatingGroupPermissions"
                v-close-popup
                @click="updateGroupPermissions"
              />
            </div>
          </div>
          <!-- @input="$refs.groupsSelect.hidePopup" -->
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
import { getRules } from '@/utils/utils'

export default {
  components: {
    Menu,
  },
  data() {
    return {
      selectedGroup: null,
      groupPermissions: [],
      loadingGroupPermissions: false,
      updatingGroupPermissions: false,
    }
  },
  computed: {
    groups: get('auth/groups'),
    permissions: get('auth/permissions'),
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
  },
  watch: {
    groups(newVal) {
      if (newVal && newVal.length) {
        this.selectedGroup = newVal[0]
      }
    },
    selectedGroup(newVal) {
      this.fetchGroupPermissions(newVal.id)
    },
  },
  mounted() {
    if (this.groups.length) this.selectedGroup = this.groups[0]
  },
  methods: {
    fetchGroups: call('auth/fetchGroups'),
    async fetchGroupPermissions(id) {
      this.loadingGroupPermissions = true
      const response = await api.fetchGroupPermissions(id)
      if (response.ok)
        this.groupPermissions = this.permissions
          .map((p) => ({
            id: p.id,
            checked: response.data.includes(p.id),
          }))
          .sort((a, b) => a.id.localeCompare(b.id))
      this.loadingGroupPermissions = false
    },

    async updateGroupPermissions() {
      this.updatingGroupPermissions = true
      const permissions = this.groupPermissions
        .filter((gp) => gp.checked)
        .map((gp) => gp.id)
      const response = await api.updateGroupPermissions({
        id: this.selectedGroup.id,
        permissions,
      })
      if (response.ok) {
        this.$toast.open('Group Permissions updated sucessfully.')
        this.fetchGroupPermissions(this.selectedGroup.id)
        this.fetchGroups()
      }
      this.updatingGroupPermissions = false
    },
    getRules(rulesNames) {
      return getRules(rulesNames)
    },
  },
}
</script>
