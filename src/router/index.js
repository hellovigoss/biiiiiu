import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'screen',
    component: () => import('../views/ScreenView.vue')
  },
  {
    path: '/capture/:screen',
    name: 'capture',
    props: true,
    component: () => import('../views/CaptureView.vue')
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/CaptureView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
