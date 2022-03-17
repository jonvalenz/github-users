import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import RouteNames from '@/constants/route-names';
import DashBoard from '../views/dash-board.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: RouteNames.DASHBOARD,
    component: DashBoard,
  },
  {
    path: '/user',
    name: RouteNames.USER,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/user-projects.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
