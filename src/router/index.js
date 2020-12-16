import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Register from '@/components/Register'
import HomeT from '@/components/HomeT'

Vue.use(VueRouter)

/*export default new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/home', component: Home }
  ]
})*/


const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/home', component: Home },
    { path: '/homet', component: HomeT}
  ]
})
//挂载路由导航守卫
router.beforeEach((to , from ,next )=>{//to将要访问的路径
//from代表从哪个路径跳转而来
//next是一个函数，表示放行
//next（）放行 next（'/login'）强制跳转

  //login register页面 放行
  if (to.path ==='/login') return next()
  if (to.path ==='/register') return next()
  //获取id 如果没有 全部跳转登录
  const id=window.sessionStorage.getItem('id')
  if (!id) return next('/login')
  //获取 放行
  next()
})

export default router
