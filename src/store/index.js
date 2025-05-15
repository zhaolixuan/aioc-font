import Vue from 'vue'
import vuex from 'vuex'
import api from '@/api/api'
import { log } from 'three'
Vue.use(vuex)

export default new vuex.Store({
  state: {
    index: 0,
    activeKey: -1, // 顶部导航选中项
    activeName: '',
    dialogVisible: false,
    isVisibleFirst: false,
    isVisibleSecond: false,
    businessIncometTitle:'',
  },
  
  mutations: { // 更改state状态
    setBusinessIncometTitle(state, value) {
      state.businessIncometTitle = value
    },
    setActiveKey(state, value) {
      state.activeKey = value
    },
    setActiveName(state, value) {
      state.activeName = value
    },
    setDialogVisible(state, value) {
      state.dialogVisible = value
    },
    setTitle(state, value) {
      state.title = value
    },
    setActiveTitle(state, value) {
      state.activeTitle = value
    },
    setIndex(state, value) {
      state.index = value;
    },
    isVisibleFirst(state, value) {
      state.isVisibleFirst = value;
    },
    isVisibleSecond(state, value) {
      state.isVisibleSecond = value;
    }
  },
  actions: { // 异步请求
    getUserInfo({ commit }){
      api.getInfo().then(res=>{
        if (res.code == 200) {
          commit('setActiveName',res.user.userName)
        }
      })
    }
  }
})
