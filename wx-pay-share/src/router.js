import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/index'
    },{
      path: '/index',
      name: 'index',
      component: () => import("@/views/index"),
      mate: { title: '首页' }
    },{
      path: '/activity',
      name: 'activity',
      component: () => import("@/views/activity"),
      mate: { title: '活动' }
    },{
      path: '/pay',
      name: 'pay',
      component: () => import("@/views/pay"),
      mate: { title: '充值' }
    },
    // {
    //   path: '/about',
    //   name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
    //   component: () => import( webpackChunkName: "about"  './views/About.vue')
    // }
  ]
})
