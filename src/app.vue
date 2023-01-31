<template>
  <div id="app">
    <q-layout style="min-height: 100vh">
      <Navbar
        logo="Minerva Avalie"
        :username="user[userPreferences.displayName]"
        :userRole="userRole"
        :drawer-items="navbarDrawerItems"
        :user-menu-items="userMenuItems"
        :isUserAuthenticated="isUserAuthenticated"
        drawer-footer=""
        :stage="stage"
        @onLogout="logout"
        @onSectionSelected="onNavSectionSelected"
      />
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { get, call } from 'vuex-pathify'
import Navbar from '@/components/common/layout/navbar.vue'

export default {
  components: {
    Navbar,
  },
  computed: {
    user: get('auth/user'),
    userRole: get('auth/userRole'),
    userPreferences: get('auth/userPreferences'),
    userHasPermission: get('auth/userHasPermission'),
    isUserAdmin: get('auth/isUserAdmin'),
    isUserAuthenticated: get('auth/isUserAuthenticated'),
    isUserAuthenticating: get('auth/isUserAuthenticating'),
    stage: () => process.env.VUE_APP_STAGE || 'dev',
    headersCache() {
      return JSON.parse(localStorage.getItem('navbarHeaders') || '{}')
    },
    navbarDrawerItems() {
      return [
        {
          text: 'Página Inicial',
          icon: 'mdi-view-dashboard',
          url: '/',
          visible: true,
        },
        {
          header: 'Operations',
          icon: null,
          open: this.isHeaderOpen('Operations'),
          visible: this.userHasPermission('ops:read'),
          children: [
            {
              text: null,
              url: null,
              visible: true,
              children: [
                {
                  header: 'Brazil Primary Market',
                  icon: 'mdi-layers-outline',
                  open: this.isHeaderOpen('Brazil Primary Market'),
                  visible: this.userHasPermission('ops:brazil-pm'),
                  children: [
                    {
                      text: 'Dashboard',
                      icon: 'mdi-view-dashboard-outline',
                      url: '/ops/brazil-primary-market/dashboard',
                      visible: true,
                    },
                    {
                      text: 'EMPF',
                      icon: 'mdi-weather-sunset-up',
                      url: '/ops/brazil-primary-market/empf',
                      visible: this.userHasPermission('ops:brazil-pm-empf'),
                    },
                    {
                      text: 'ESER',
                      icon: 'mdi-file-upload-outline',
                      url: '/ops/brazil-primary-market/eser',
                      visible: true,
                    },
                    {
                      text: 'EMSE',
                      icon: 'mdi-file-compare',
                      url: '/ops/brazil-primary-market/emse',
                      visible: true,
                    },
                    {
                      text: 'ECVF',
                      icon: 'mdi-cash',
                      url: '/ops/brazil-primary-market/ecvf',
                      visible: true,
                    },
                  ],
                },
              ],
            },
            {
              text: null,
              url: null,
              visible: true,
              children: [
                {
                  header: 'Global Primary Market',
                  icon: 'mdi-earth',
                  open: this.isHeaderOpen('Global Primary Market'),
                  visible: this.userHasPermission('ops:global-pm'),
                  children: [
                    {
                      text: 'Management Panel',
                      icon: 'mdi-view-dashboard-edit-outline',
                      url: '/ops/global-primary-market/management-panel',
                      visible: this.userHasPermission('ops:global-pm-manage'),
                    },
                    {
                      text: 'Request Placement',
                      icon: 'mdi-file-edit-outline',
                      url: '/ops/global-primary-market/request-placement',
                      visible: this.userHasPermission('ops:global-pm'),
                    },
                  ],
                },
              ],
            },
            {
              text: null,
              url: null,
              visible: true,
              children: [
                {
                  header: 'PCF',
                  icon: 'mdi-chart-arc',
                  open: this.isHeaderOpen('PCF'),
                  visible: this.userHasPermission('ops:pcfs'),
                  children: [
                    {
                      text: 'Generate and Publish',
                      icon: 'mdi-send',
                      url: '/ops/pcf',
                      visible: this.userHasPermission('ops:pcfs'),
                    },
                    {
                      text: 'Cash Creation Report',
                      icon: 'mdi-text-box-outline',
                      url: '/ops/pcf/cash-creation-report',
                      visible: this.userHasPermission('ops:pcfs'),
                    },
                  ],
                },
              ],
            },
            {
              text: 'Fund Portfolio',
              icon: 'mdi-upload-outline',
              url: '/ops/fund-portfolio',
              visible: this.userHasPermission('ops:wallet-import'),
            },
            {
              text: null,
              url: null,
              visible: true,
              children: [
                {
                  header: 'PAS',
                  icon: 'mdi-bank-outline',
                  open: this.isHeaderOpen('PAS'),
                  visible: this.userHasPermission('ops:pas'),
                  children: [
                    {
                      text: null,
                      url: null,
                      visible: true,
                      children: [
                        {
                          header: 'Reference Data',
                          icon: 'mdi-database-outline',
                          open: this.isHeaderOpen('Reference Data'),
                          visible: this.userHasPermission('ops:pas-rd'),
                          children: [
                            {
                              text: 'Business Partners',
                              icon: 'mdi-account-group-outline',
                              url: '/ops/pas/reference-data/business-partners',
                              visible: this.userHasPermission(
                                'ops:pas-rd-business-partners',
                              ),
                            },
                            {
                              text: 'Instruments',
                              icon: 'mdi-circle-multiple-outline',
                              url: '/ops/pas/reference-data/instruments',
                              visible: this.userHasPermission(
                                'ops:pas-rd-instruments',
                              ),
                            },
                          ],
                        },
                      ],
                    },
                    {
                      text: null,
                      url: null,
                      visible: true,
                      children: [
                        {
                          header: 'Account Mgmt',
                          icon: 'mdi-wallet-outline',
                          open: this.isHeaderOpen('Account Mgmt'),
                          visible: this.userHasPermission('ops:pas-am'),
                          children: [
                            {
                              text: 'Digital Asset Accounts',
                              icon: 'mdi-currency-btc',
                              url: '/ops/pas/account-mgmt/digital-asset-accounts',
                              visible: this.userHasPermission(
                                'ops:pas-am-digital-asset-accounts',
                              ),
                            },
                          ],
                        },
                      ],
                    },
                    {
                      text: 'Crypto Address Validator',
                      icon: 'mdi-shield-check-outline',
                      url: '/ops/pas/address-validator',
                      visible: this.userHasPermission('ops:address-validator'),
                    },
                  ],
                },
              ],
            },
            {
              text: null,
              url: null,
              visible: true,
              children: [
                {
                  header: 'Routines',
                  icon: 'mdi-clock-outline',
                  open: this.isHeaderOpen('Routines'),
                  visible: this.userHasPermission('ops:routines'),
                  children: [
                    {
                      text: 'Dashboard',
                      icon: 'mdi-view-dashboard-outline',
                      url: '/ops/routines/dashboard',
                      visible: this.userHasPermission('ops:routines'),
                    },
                    {
                      text: 'Inoa Crypto Prices',
                      icon: 'mdi-cog-outline',
                      url: '/ops/routines/inoa-crypto-prices',
                      visible: this.userHasPermission('ops:routines'),
                    },
                  ],
                },
              ],
            },
            {
              text: 'Funds',
              icon: 'mdi-format-list-bulleted',
              url: '/ops/funds',
              visible: this.userHasPermission('ops:funds'),
            },
            {
              text: 'Mailing Lists',
              icon: 'mdi-account-group-outline',
              url: '/ops/mailing-lists',
              visible: this.userHasPermission('ops:mailing-lists'),
            },
          ],
        },
        {
          header: 'Investment Management',
          icon: null,
          open: this.isHeaderOpen('Investment Management'),
          visible: this.userHasPermission('im:read'),
          children: [
            {
              text: 'Crypto Trading',
              icon: 'mdi-swap-horizontal-circle-outline',
              url: '/investment-management/crypto-trading',
              visible: this.userHasPermission('im:crypto-trading'),
            },
            {
              text: 'Fiat Trading',
              icon: 'mdi-swap-horizontal-circle-outline',
              url: '/#',
              visible: false,
            },
          ],
        },
      ]
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
          url: '/admin/users',
          visible: this.isUserAdmin,
        },
      ]
    },
  },
  beforeMount() {
    // this.fetchUserInfo()
    // if (this.isUserAuthenticated) {
    //   this.fetchGroups()
    //   this.fetchPermissions()
    // }
  },
  methods: {
    fetchUsers: call('auth/fetchUsers'),
    fetchUserInfo: call('auth/fetchUserInfo'),
    logout: call('auth/logout'),
    fetchGroups: call('auth/fetchGroups'),
    fetchPermissions: call('auth/fetchPermissions'),
    fetchGroupsPermissions: call('auth/fetchGroupsPermissions'),
    fetchFunds: call('funds/fetchFunds'),
    isHeaderOpen(header) {
      // Cache data to see if a section is open
      return (
        this.headersCache.hasOwnProperty(header) && this.headersCache[header]
      )
    },
    onNavSectionSelected(e) {
      // Update Navbar Headers cache
      const headersCache = JSON.parse(
        localStorage.getItem('navbarHeaders') || '{}',
      )

      if (headersCache.hasOwnProperty(e.header))
        headersCache[e.header] = !headersCache[e.header]
      else headersCache[e.header] = true

      localStorage.setItem('navbarHeaders', JSON.stringify(headersCache))
    },
  },
}
</script>
