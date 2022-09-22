// 这里是路由
import Vue from "vue";
import VueRouter from 'vue-router'
import HomeView from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: '/home',
  },
  {
    path: "/adminlogin",
    component: resolve => require(["../components/Login.vue"], resolve), //异步加载路由，懒加载的一种写法
    hidden: true,
  },
  {
    path: "/home",
    component: HomeView, //HomeView组件是在代码编译时就会加载的
    redirect: "/welcome",
    children: [
      {path: "/welcome",component: resolve => require(["../components/Welcome.vue"], resolve),},
      {path:"/users",component: resolve => require(["../components/users/Users.vue"], resolve),},
      {path:"/rights",component: resolve => require(["../components/power/Rights.vue"], resolve),},
      {path:"/roles",component: resolve => require(["../components/power/Roles.vue"], resolve),},
    ]
  },
];

const router = new VueRouter({
  routes,
  mode: 'hash',
})

//挂载路由导航守卫
//to是我们跳转的路径，from是来自的路径，next为放行函数
router.beforeEach((to, from, next) => {
  //如果用户访问登录页，直接放行
  if (to.path === "/adminlogin") { return next(); }
  //从sessionStorage中获取到保存的token值
  const tokenStr = window.sessionStorage.getItem("token");
  //没有token，强制跳转到登录页面
  if (!tokenStr) { return router.push("/adminlogin"); }
  else { next(); }//有token，直接放行
})

export default router