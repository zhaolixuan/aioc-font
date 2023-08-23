import Vue from 'vue'
import Router from 'vue-router'
import Leader from '@/views/CockpitBigScreen/index'
import Login from '@/views/login/index'
import map from '@/views/gdmap/index'

Vue.use(Router)

const router = new Router({
    // mode: 'history',
    routes: [
        {
            path: '/index',
            name: 'Leader',
            component: Leader
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/',
            name: 'map',
            component: map
        },

        

    ]
})
// router.beforeEach((to, from, next) => {
//   let url = document.location.href
//   // 页面的登录验证（除了登录页）
//   if (to.matched.some(res => res.path.indexOf('sso') === -1)) {
//     let gunsToken = getCookie('gunsToken')
//     if (gunsToken) {
//       // 设置各个页面的标题
//       if (to.meta.title) {
//         document.title = to.meta.title
//       }
//       next()
//       // 验证token
//       api.checkoutGunsToken({gunsToken: gunsToken}).then((res) => {
//         if (res.code == 200) {
//           console.log('token验证通过')
//         } else {
//           console.log('token验证失败')
//           document.location.href = logindomain + '/sso/?redirectUrl=' + url
//         }
//       })
//     } else {
//       document.location.href = logindomain + '/sso/?redirectUrl=' + url
//     }
//   } else {
//     // 设置各个页面的标题
//     if (to.meta.title) {
//       document.title = to.meta.title
//     }
//     next()
//   }
// })

export default router
