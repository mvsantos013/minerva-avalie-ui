<template>
  <div id="app" v-if="!fullScreenLoading">
    <q-layout class="layout">
      <Navbar
        v-if="showNavbar"
        logo="Minerva Avalie"
        :username="user[userPreferences.displayName]"
        :userRole="userRole"
        :drawer-items="navbarDrawerItems"
        :user-menu-items="userMenuItems"
        :isUserAuthenticated="isUserAuthenticated"
        :transparentAtTop="navbarTransparentAtTop"
        drawer-footer=""
        :stage="stage"
        @onLogin="$router.push('/login')"
        @onLogout="logout"
      />

      <q-page-container>
        <div
          v-if="userHasGroup('Convidado')"
          class="bg-gray-400 py-3 text-center text-white w-full"
        >
          Você está autenticado como convidado, um administrador concederá
          permissões que se adequam ao seu perfil. <br />
          Após isso, reconecte-se para atualizar suas permissões.
        </div>
        <transition name="fade" mode="out-in" duration="60">
          <router-view />
        </transition>
      </q-page-container>

      <Footer />
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
import { QSpinnerTail } from 'quasar'
import Navbar from '@/components/common/layout/navbar.vue'
import Footer from '@/components/common/layout/footer.vue'

export default {
  components: {
    QSpinnerTail,
    Navbar,
    Footer,
  },
  computed: {
    user: get('auth/user'),
    userRole: get('auth/userRole'),
    userPreferences: get('auth/userPreferences'),
    userHasGroup: get('auth/userHasGroup'),
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
          visible: this.userHasGroup('Admin|Moderator'),
        },
      ]
    },
    navbarTransparentAtTop() {
      return this.$route.name === 'home'
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

<style lang="postcss">
.layout {
  padding-bottom: 9rem;
}
</style>
