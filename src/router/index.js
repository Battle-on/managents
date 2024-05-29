import Vue from "vue";
import Router from "vue-router";

/* Layout */
import Layout from "@/layout";

Vue.use(Router);

export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },


  {
    path: "/setting",
    component: Layout,
    meta: {
      title: "系统设置",
      icon: "el-icon-setting",
    },
    children: [
        {
            path: "user",
            name: "userSetting",
            component: () => import("@/views/setting/user"),
            meta: { title: "用户管理", icon: "el-icon-user-solid" },
          },
          {
            path: "page",
            name: "pageSetting",
            component: () => import("@/views/setting/page"),
            meta: { title: "系统管理", icon: "el-icon-s-cooperation" },
          },
    ],
  },


  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
