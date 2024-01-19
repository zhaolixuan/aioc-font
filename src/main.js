import Vue from 'vue'
import App from './App'
import router from './router'
import echarts from 'echarts'
import iconfont from './assets/iconfont/iconfont.css'
import './utils/rem'
import store from './store'
import ElementUI from 'element-ui'
import animated from 'animate.css'
import '@/assets/styles/index.less' // global css
import '@/assets/styles/mounttai.less' // mounttai css
import './assets/icons' // icon
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree } from "@/utils/mounttai";

import 'element-ui/lib/theme-chalk/index.css'
import DictTag from '@/components/DictTag'

import './common/js/css.js'
import vuescroll from 'vuescroll'
import VueLazyload from 'vue-lazyload'
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts // 全局引入echarts，调用时通过 this.$echarts 调用

// 全局方法挂载
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.handleTree = handleTree




Vue.component('DictTag', DictTag)

Vue.use(ElementUI)
Vue.use(animated)
Vue.use(vuescroll)
Vue.use(VueLazyload,{
  error: require('./assets/image/moren.png'),
  loading: require('./assets/image/moren.png')
});
/* eslint-disable no-new */


var vm = new Vue({
  el: '#app',
  router,
  store,
  iconfont,
  components: { App },
  template: '<App/>'
})
