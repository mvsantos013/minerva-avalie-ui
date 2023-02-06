<template>
  <div class="container mt-5 bg-white rounded-md">
    <div class="flex">
      <div class="flex-grow p-3 pb-10">
        <div class="flex flex-col">
          <div class="app-title pb-2">Perfil</div>
          <Username
            :username="user.name"
            class="pb-3"
            @onUpdate="updateUsername"
          />
          <Email :email="user.email" class="pb-5" />
          <!-- <Groups :userGroups="userGroups" class="pb-3" /> -->
          <div v-if="isUserRealAdmin">
            <hr class="my-2" />
            <h5 class="mt-2 mb-4 text-base">Development settings</h5>
            <SimulateGroup
              :simulated-group="userPreferences.simulatedGroup"
              @onUpdate="updateUserSimulatedGroup"
            />
          </div>
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
import Username from '@/components/account/user-profile/username.vue'
import Email from '@/components/account/user-profile/email.vue'
// import Groups from '@/components/account/user-profile/groups.vue'
import SimulateGroup from '@/components/account/user-profile/simulate-group.vue'

export default {
  components: {
    Menu,
    Username,
    Email,
    // Groups,
    SimulateGroup,
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
    user: get('auth/user'),
    userGroups: get('auth/userGroups'),
    userPreferences: get('auth/userPreferences'),
    isUserRealAdmin: get('auth/isUserRealAdmin'),
  },
  methods: {
    updateUsername: call('auth/updateUsername'),
    updateUserPreferences: call('auth/updateUserPreferences'),
    updateUserSimulatedGroup(group) {
      this.updateUserPreferences({ simulatedGroup: group })
    },
  },
}
</script>
