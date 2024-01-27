export default (userHasGroup, userHasPermission) => [
  {
    category: null,
    children: [
      {
        text: 'Definições Globais',
        icon: 'mdi-cog-outline',
        url: '/admin/configurations',
        visible: userHasPermission('manage:configurations'),
      },
      {
        text: 'Grupos de usuário',
        icon: 'mdi-shape-outline',
        url: '/admin/groups',
        visible: userHasPermission('manage:groups'),
      },
      {
        text: 'Permissões',
        icon: 'mdi-list-status',
        url: '/admin/permissions',
        visible: userHasPermission('manage:permissions'),
      },
      {
        text: 'Permissões de grupos',
        icon: 'mdi-order-bool-descending',
        url: '/admin/groups/permissions',
        visible: userHasPermission('manage:groups-permissions'),
      },
      {
        text: 'Departamentos',
        icon: 'mdi-format-list-bulleted',
        url: '/admin/departments',
        visible: userHasPermission('manage:departments'),
      },
      {
        text: 'Disciplines',
        icon: 'mdi-book-open-blank-variant',
        url: '/admin/disciplines',
        visible: userHasPermission('manage:disciplines'),
      },
      {
        text: 'Professores',
        icon: 'mdi-human-male-board',
        url: '/admin/professors',
        visible: userHasPermission('manage:professors'),
      },
      {
        text: 'Questões Avaliativas',
        icon: 'mdi-list-box-outline',
        url: '/admin/questions',
        visible: userHasPermission('manage:questions'),
      },
      {
        text: 'Denúncias',
        icon: 'mdi-flag-variant-outline',
        url: '/admin/reports',
        visible: userHasPermission('manage:testimonial-reports'),
      },
    ],
  },
]
