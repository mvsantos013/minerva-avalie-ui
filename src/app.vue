<template>
  <div id="app" v-if="!fullScreenLoading">
    <q-layout style="min-height: 100vh">
      <Navbar
        v-if="showNavbar"
        logo="Minerva Avalie"
        :username="user[userPreferences.displayName]"
        :userRole="userRole"
        :drawer-items="navbarDrawerItems"
        :user-menu-items="userMenuItems"
        :isUserAuthenticated="isUserAuthenticated"
        drawer-footer=""
        :stage="stage"
        @onLogin="$router.push('/login')"
        @onLogout="logout"
      />
      <q-page-container>
        <transition name="fade" mode="out-in" duration="60">
          <router-view />
        </transition>
      </q-page-container>
    </q-layout>
  </div>
  <div
    v-else
    class="flex items-center justify-center min-h-screen border bg-primary-400"
  >
    <QSpinnerTail color="white" size="4rem" />
  </div>
</template>

<script>
import { get, call } from 'vuex-pathify'
import Navbar from '@/components/common/layout/navbar.vue'
import { QSpinnerTail } from 'quasar'

export default {
  components: {
    Navbar,
    QSpinnerTail,
  },
  computed: {
    user: get('auth/user'),
    userRole: get('auth/userRole'),
    userPreferences: get('auth/userPreferences'),
    userHasPermission: get('auth/userHasPermission'),
    isUserAdmin: get('auth/isUserAdmin'),
    isUserAuthenticated: get('auth/isUserAuthenticated'),
    isUserAuthenticating: get('auth/isUserAuthenticating'),
    fullScreenLoading: get('general/fullScreenLoading'),
    stage: () => process.env.VUE_APP_STAGE || 'dev',
    showNavbar() {
      return this.$route.name !== 'login'
    },
    navbarDrawerItems() {
      return []
    },
    userMenuItems() {
      return [
        {
          text: 'Perfil',
          url: '/account/profile',
          visible: true,
        },
        {
          text: 'Preferências',
          url: '/account/preferences',
          visible: true,
        },
        {
          text: 'Admin Painel',
          url: '/admin/professors',
          visible: this.isUserAdmin,
        },
      ]
    },
  },
  async beforeMount() {
    if (this.isUserAuthenticated) {
      await this.fetchUserInfo()
      this.fetchUserGroupsPermissions()
    }
  },
  methods: {
    logout: call('auth/logout'),
    fetchUserInfo: call('auth/fetchUserInfo'),
    fetchUserGroupsPermissions: call('auth/fetchUserGroupsPermissions'),
  },
}
</script>
