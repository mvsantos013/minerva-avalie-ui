export default [
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () => import('@/pages/admin/admin-users.vue'),
    meta: { requiresAuth: true, group: 'Admin' },
  },
  {
    path: '/admin/groups',
    name: 'admin-groups',
    component: () => import('@/pages/admin/admin-groups.vue'),
    meta: { requiresAuth: true, group: 'Admin' },
  },
  {
    path: '/admin/permissions',
    name: 'admin-permissions',
    component: () => import('@/pages/admin/admin-permissions.vue'),
    meta: { requiresAuth: true, group: 'Admin' },
  },
  {
    path: '/admin/groups/permissions',
    name: 'admin-groups-permissions',
    component: () => import('@/pages/admin/admin-groups-permissions.vue'),
    meta: { requiresAuth: true, group: 'Admin' },
  },
]
