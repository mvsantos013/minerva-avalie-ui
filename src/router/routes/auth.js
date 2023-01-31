export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/auth/login.vue'),
    meta: { requiresNoAuth: true },
  },
  {
    path: '/account/profile',
    name: 'account-profile',
    component: () => import('@/pages/account/user-profile.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/account/preferences',
    name: 'account-preferences',
    component: () => import('@/pages/account/user-preferences.vue'),
    meta: { requiresAuth: true },
  },
]
