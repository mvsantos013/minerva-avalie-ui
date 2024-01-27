export default [
  {
    path: '/admin/configurations',
    name: 'admin-configurations',
    component: () => import('@/pages/admin/configurations.vue'),
    meta: { requiresAuth: true, group: 'Admin' },
  },
  {
    path: '/admin/groups',
    name: 'admin-groups',
    component: () => import('@/pages/admin/groups.vue'),
    meta: { requiresAuth: true, group: 'Admin' },
  },
  {
    path: '/admin/permissions',
    name: 'admin-permissions',
    component: () => import('@/pages/admin/permissions.vue'),
    meta: { requiresAuth: true, group: 'Admin' },
  },
  {
    path: '/admin/groups/permissions',
    name: 'admin-groups-permissions',
    component: () => import('@/pages/admin/groups-permissions.vue'),
    meta: { requiresAuth: true, group: 'Admin' },
  },
  {
    path: '/admin/departments',
    name: 'admin-departments',
    component: () => import('@/pages/admin/departments.vue'),
    meta: { requiresAuth: true, group: 'Admin|Moderator' },
  },
  {
    path: '/admin/disciplines',
    name: 'admin-disciplines',
    component: () => import('@/pages/admin/disciplines.vue'),
    meta: { requiresAuth: true, group: 'Admin|Moderator' },
  },
  {
    path: '/admin/professors',
    name: 'admin-professors',
    component: () => import('@/pages/admin/professors.vue'),
    meta: { requiresAuth: true, group: 'Admin|Moderator' },
  },
  {
    path: '/admin/questions',
    name: 'admin-questions',
    component: () => import('@/pages/admin/questions.vue'),
    meta: { requiresAuth: true, group: 'Admin|Moderator' },
  },
  {
    path: '/admin/reports',
    name: 'admin-reports',
    component: () => import('@/pages/admin/reports.vue'),
    meta: { requiresAuth: true, group: 'Admin|Moderator' },
  },
]
