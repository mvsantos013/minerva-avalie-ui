<template>
  <div>
    <q-header ref="header" class="navbar fixed bg-primary-500 shadow-md">
      <q-toolbar class="container">
        <!-- <q-btn flat round icon="mdi-menu" @click="drawerOpen = !drawerOpen" /> -->

        <q-toolbar-title class="flex items-center cursor-default">
          <router-link to="/">
            <q-img
              :src="require('@/assets/imgs/logo-minerva-avalie-white.png')"
              class="w-8 mr-3"
            ></q-img>
          </router-link>

          <div class="text-gray-200">{{ logo }}</div>

          <span
            v-if="stage != 'prod' && !$q.platform.is.mobile"
            class="px-2 py-1 ml-4 text-xs rounded-md bg-primary-400"
          >
            Development Environment
          </span>
        </q-toolbar-title>

        <div class="mr-3" v-if="!$q.platform.is.mobile">
          {{ username }}
          <span v-if="userRole">
            ({{ userRole !== 'Student' ? userRole : 'Aluno' }})
          </span>
        </div>

        <div>
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
          <q-tooltip class="w-32">Perfil</q-tooltip>
        </div>

        <div v-if="!isUserAuthenticated">
          <q-btn flat @click="$emit('onLogin')">Entrar</q-btn>
        </div>

        <!-- <div>
          <q-btn-dropdown
            color="white"
            flat
            round
            icon="mdi-github"
            class="hide-arrow m-1"
          >
            <q-list class="w-52">
              <a
                href="https://github.com/mvsantos013/minerva-avalie-bff"
                target="_blank"
              >
                <q-item clickable v-close-popup>
                  <q-item-section>
                    <q-item-label> minerva-avalie-bff </q-item-label>
                  </q-item-section>
                </q-item>
              </a>
              <a
                href="https://github.com/mvsantos013/minerva-avalie-ui"
                target="_blank"
              >
                <q-item clickable v-close-popup>
                  <q-item-section>
                    <q-item-label> minerva-avalie-ui </q-item-label>
                  </q-item-section>
                </q-item>
              </a>
            </q-list>
          </q-btn-dropdown>
          <q-tooltip class="w-32">Código-Fonte</q-tooltip>
        </div> -->

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

    <q-drawer v-if="false" v-model="drawerOpen" bordered>
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
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../../../tailwind.config.js'
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
    transparentAtTop: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      drawerOpen: false,
      tailwindCfg: resolveConfig(tailwindConfig),
    }
  },
  computed: {
    primaryColor() {
      const primaryColorHex = this.tailwindCfg.theme.colors.primary[500]
      const primaryColorRgb = this.hexToRgb(primaryColorHex)
      return primaryColorRgb
    },
  },
  watch: {
    transparentAtTop: {
      handler: function (isTransparent) {
        const navbar = this.$refs.header?.$el
        if (!navbar) return

        if (isTransparent) {
          navbar.style.backgroundColor = 'transparent'
          navbar.classList.remove('shadow-md')
          window.addEventListener('scroll', this.handleScroll)
        } else {
          window.removeEventListener('scroll', this.handleScroll)
          navbar.style.backgroundColor = `rgba(${this.primaryColor.join(
            ',',
          )}, 1)`
          navbar.classList.add('shadow-md')
        }
      },
      immediate: true,
    },
  },
  destroyed() {
    if (this.transparentAtTop) {
      window.removeEventListener('scroll', this.handleScroll)
    }
  },
  methods: {
    handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const navbar = this.$refs.header.$el
      const threshold = 250
      const navbarOpacity = scrollTop > threshold ? 1 : scrollTop / threshold
      const [r, g, b] = this.primaryColor
      navbar.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${navbarOpacity})`
      if (navbarOpacity >= 1) this.$refs.header.$el.classList.add('shadow-md')
      else this.$refs.header.$el.classList.remove('shadow-md')
    },
    hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16),
          ]
        : null
    },
  },
}
</script>

<style lang="postcss">
.navbar {
  transition: box-shadow 0.3s ease-in-out;
}

.hide-arrow {
  border-radius: 100% !important;
  width: 2.5rem !important;
  height: 2.5rem !important;

  .q-btn-dropdown__arrow {
    @apply hidden;
  }
}
</style>
