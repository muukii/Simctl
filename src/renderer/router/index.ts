import Vue from 'vue'
import Router from 'vue-router'

import SimulatorList from '@/components/SimulatorList/SimulatorList.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'simulator-list',
      component: SimulatorList as any
    },
    // {
    //   path: '*',
    //   redirect: '/'
    // }
  ]
})
