<template>
  <div>
    <q-header>
      <q-toolbar class="bg-primary-500">
        <!-- <q-btn flat round icon="mdi-menu" @click="drawerOpen = !drawerOpen" /> -->

        <q-toolbar-title class="flex items-center cursor-default">
          <router-link to="/">
            <q-img
              :src="require('@/assets/imgs/logo-minerva-avalie-white.png')"
              class="w-8 mr-3"
            ></q-img>
          </router-link>

          {{ logo }}

          <span
            v-if="stage != 'prod'"
            class="px-2 py-1 ml-4 text-xs rounded-md bg-primary-400"
          >
            Development Environment
          </span>
        </q-toolbar-title>

        <div class="mr-3">{{ username }}</div>

        <q-btn-dropdown
          v-if="isUserAuthenticated"
          color="white"
          flat
          round
          icon="mdi-account-circle"
          class="mr-1 hide-arrow"
        >
          <q-list class="w-52">
            <template v-for="item in userMenuItems">
              <q-item
                v-if="item.visible"
                :key="item.text"
                :to="item.url"
                clickable
                v-close-popup
              >
                <q-item-section>
                  <q-item-label>{{ item.text }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-list>
        </q-btn-dropdown>

        <div v-if="isUserAuthenticated">
          <q-btn
            icon="mdi-exit-to-app"
            flat
            round
            @click="$emit('onLogout')"
          ></q-btn>
          <q-tooltip> Sair </q-tooltip>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawerOpen" bordered>
      <ExpansionMenu
        :items="drawerItems"
        @onItemSelected="(e) => $emit('onItemSelected', e)"
        @onSectionSelected="(e) => $emit('onSectionSelected', e)"
        style="padding-bottom: 2.5rem"
      />
      <div
        v-if="drawerFooter"
        class="absolute bottom-0 w-full py-2 text-center border-t bg-white text-xs text-gray-600"
      >
        {{ drawerFooter }}
      </div>
    </q-drawer>
  </div>
</template>

<script>
import ExpansionMenu from '@/components/common/menu/expansion-menu.vue'

export default {
  components: { ExpansionMenu },
  props: {
    logo: {
      type: String,
      default: 'App',
    },
    drawerItems: {
      type: Array,
      default: () => [],
    },
    username: {
      type: String,
      default: '',
    },
    userRole: {
      type: String,
      default: '',
    },
    drawerFooter: {
      type: String,
      default: '',
    },
    stage: {
      type: String,
      default: 'dev',
    },
    hideSettings: {
      type: Boolean,
      default: false,
    },
    isUserAuthenticated: {
      type: Boolean,
      default: false,
    },
    userMenuItems: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      drawerOpen: false,
    }
  },
}
</script>

<style lang="postcss">
.hide-arrow {
  border-radius: 100% !important;
  width: 2.5rem !important;
  height: 2.5rem !important;

  .q-btn-dropdown__arrow {
    @apply hidden;
  }
}
</style>
