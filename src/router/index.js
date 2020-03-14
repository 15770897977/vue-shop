import Vue from 'vue'
import Router from 'vue-router'
// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
// import User from '../components/user/Users.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'
// import Cate from '../components/goods/Cate.vue'
// import Params from '../components/goods/Params.vue'
// import List from '../components/goods/List.vue'
// import Add from '../components/goods/Add.vue'
// import Order from '../components/order/Order.vue'
// import Report from '../components/report/Report.vue'

const Login = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/Welcome.vue')
const User = () => import(/* webpackChunkName: "user" */ '../components/user/Users.vue')
const Rights = () => import(/* webpackChunkName: "power" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "power" */ '../components/power/Roles.vue')
const Cate = () => import(/* webpackChunkName: "goods" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "goods" */ '../components/goods/Params.vue')
const List = () => import(/* webpackChunkName: "goods" */ '../components/goods/List.vue')
const Add = () => import(/* webpackChunkName: "goods" */ '../components/goods/Add.vue')
const Order = () => import(/* webpackChunkName: "order" */ '../components/order/Order.vue')
const Report = () => import(/* webpackChunkName: "report" */ '../components/report/Report.vue')

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: User },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: List },
        { path: '/goods/add', component: Add },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report }
      ]
    }
  ]
})
// 路由导航守卫
router.beforeEach((to, from, next) => {
  // 访问登录页，放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token, 强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})
export default router
