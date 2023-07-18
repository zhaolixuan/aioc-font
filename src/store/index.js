import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex)

export default new vuex.Store({
  state: {
    index: 0,
    activeKey: -1, // 顶部导航选中项
    activeName: '智慧运营管理中心',
    title: '智慧运营管理中心',
    activeTitle: '智慧运营管理中心',
    dialogVisible: false,
    isVisibleFirst: false,
    isVisibleSecond: false

  },
 
  mutations: { // 更改state状态
    setActiveKey (state, value) {
      state.activeKey = value
    },
    setActiveName (state, value) {
      state.activeName = value
    },
    setDialogVisible (state, value) {
      state.dialogVisible = value
    },
    setTitle (state, value) {
      state.title = value
    },
    setActiveTitle (state, value) {
      state.activeTitle = value
    },
    setIndex(state,value){
      state.index = value;
    },
    isVisibleFirst(state,value){
      state.isVisibleFirst = value;
    },
    isVisibleSecond(state,value){
      state.isVisibleSecond = value;
    }
  },
  actions: { // 异步请求

  }
})
