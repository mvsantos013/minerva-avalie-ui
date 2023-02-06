<template>
  <div class="container mt-5 bg-white rounded-md">
    <div class="flex">
      <div class="flex-grow p-3 pb-10">
        <div class="flex flex-col">
          <div class="app-title pb-2">Preferências</div>

          <DisplayName
            :user-preferences="userPreferences"
            @onUpdate="updateDisplayName"
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
import Menu from '@/components/common/menu/base-menu.vue'
import DisplayName from '@/components/account/user-preferences/display-name.vue'

export default {
  components: {
    Menu,
    DisplayName,
  },
  data() {
    return {
      pages: [
        {
          category: null,
          children: [
            {
              text: 'Perfil',
              icon: 'mdi-cog',
              url: '/account/profile',
              visible: true,
            },
            {
              text: 'Preferências',
              icon: 'mdi-dots-vertical',
              url: '/account/preferences',
              visible: true,
            },
          ],
        },
      ],
    }
  },
  computed: {
    userPreferences: get('auth/userPreferences'),
  },
  methods: {
    updateUserPreferences: call('auth/updateUserPreferences'),
    updateDisplayName(displayName) {
      this.updateUserPreferences({ displayName })
    },
  },
}
</script>
