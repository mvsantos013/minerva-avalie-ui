export default (userHasGroup, userHasPermission) => [
  {
    category: null,
    children: [
      {
        text: 'Groups',
        icon: 'mdi-shape-outline',
        url: '/admin/groups',
        visible: userHasPermission('manage:groups'),
      },
      {
        text: 'Permissions',
        icon: 'mdi-list-status',
        url: '/admin/permissions',
        visible: userHasPermission('manage:permissions'),
      },
      {
        text: 'Groups Permissions',
        icon: 'mdi-order-bool-descending',
        url: '/admin/groups/permissions',
        visible: userHasPermission('manage:groups-permissions'),
      },
      {
        text: 'Departments',
        icon: 'mdi-format-list-bulleted',
        url: '/admin/departments',
        visible: userHasPermission('manage:departments'),
      },
      {
        text: 'Professors',
        icon: 'mdi-human-male-board',
        url: '/admin/professors',
        visible: userHasPermission('manage:professors'),
      },
      {
        text: 'Reports',
        icon: 'mdi-flag-variant-outline',
        url: '/admin/reports',
        visible: userHasPermission('manage:testimonial-reports'),
      },
    ],
  },
]
