import Vue from 'vue'
import Router from 'vue-router'

import ApolloVue from './components/ApolloExample.vue'

Vue.use(Router)

export default new Router({ 
  linkExactActiveClass: 'active',
    routes: [{ 
      path: '/signin',
      name: 'signin',
      component: () => import(/* webpackChunkName: "home" */ './views/Login.vue'),
    },{ 
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ './views/Home.vue'),
    },
    {
      path: '/postman',
      name: 'postman',
      component: () => import(/* webpackChunkName: "home" */ './views/Postman.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import(/* webpackChunkName: "home" */ './components/OpenVpn/Dashboard.vue'),
    },
    {
      path: '/server',
      name: 'server',
      component: () => import(/* webpackChunkName: "home" */ './views/ServerView.vue'),
    },
    {
      path: '/apollo',
      name: 'apollo',
      component: ApolloVue,
    },
    {
      path:'/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "home" */ './views/About.vue'),
    }
  ]

   
})