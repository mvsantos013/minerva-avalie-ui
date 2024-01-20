import Vue from 'vue'
import VueRouter from 'vue-router'
import authRoutes from './routes/auth'
import adminRoutes from './routes/admin'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL || null,
  routes: [
    ...authRoutes,
    ...adminRoutes,
    {
      path: '/departamentos/:departmentId/disciplinas/:disciplineId',
      name: 'discipline',
      component: () => import('@/pages/discipline.vue'),
      meta: {},
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/home.vue'),
      meta: {},
    },
    {
      path: '*',
      name: 'error-404',
      component: () => import('@/pages/errors/E404.vue'),
      meta: {},
    },
  ],
})

function authorize(store, to, from, next) {
  // Verifies every page that requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters['auth/isUserAuthenticated']) next()
    else {
      next({
        path: '/login',
        query: { ...(to.name !== 'logout' && { redirect: to.fullPath }) },
      })
      return
    }
  }
  // Verifies every page that requires guest
  else if (to.matched.some((record) => record.meta.requiresNoAuth)) {
    if (store.getters['auth/isUserAuthenticated']) {
      next('/')
      return
    } else next()
  }
  // Free pages
  else {
    next()
  }

  // Pages that require permission
  if (to.matched.some((record) => record.meta.permission)) {
    if (!to.meta.permission) {
      next()
    } else if (store.getters['auth/userHasPermission'](to.meta.permission)) {
      next()
    } else {
      next({ name: 'error-404' })
    }
  }

  // Pages that require group
  if (to.matched.some((record) => record.meta.group)) {
    if (!to.meta.group) {
      next()
    } else if (store.getters['auth/userHasGroup'](to.meta.group)) {
      next()
    } else {
      next({ name: 'error-404' })
    }
  }
}

router.beforeEach((to, from, next) => {
  const store = router.app.$store
  authorize(store, to, from, next)
})

export default router
