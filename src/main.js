import Vue from 'vue'
import App from './App'
import router from './router'
import echarts from 'echarts'
import iconfont from './assets/iconfont/iconfont.css'
import rem from './utils/rem'
import store from './store'
import ElementUI from 'element-ui'
import animated from 'animate.css'
import 'element-ui/lib/theme-chalk/index.css'
import './common/js/css.js'
import vuescroll from 'vuescroll'
import VueLazyload from 'vue-lazyload'
import $ from 'jquery'
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts // 全局引入echarts，调用时通过 this.$echarts 调用

Vue.use(ElementUI)
Vue.use(animated)
Vue.use(vuescroll)
Vue.use(VueLazyload,{
  error: require('./assets/img/moren.png'),
  loading: require('./assets/img/moren.png')
});
/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  store,
  iconfont,
  components: { App },
  template: '<App/>'
})
