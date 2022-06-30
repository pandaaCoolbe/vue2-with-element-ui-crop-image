import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'CropperPage1',
    component: () => import('../views/CropperPage1.vue')
  },
  {
    path: '/cropper_page2',
    name: 'CropperPage2',
    component: () => import('@/views/CropperPage2.vue')
  },
  {
    path: '/cropper_page3',
    name: 'CropperPage3',
    component: () => import('@/views/CropperPage3.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
