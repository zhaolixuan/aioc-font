/* eslint-disable */
export default {
  state:{
    dialogVisible:false,
    orgNameId: -1,
    typeNameId:-1,
    keyword: '',
    sortType: '',
    pageNo: 0

  },
  mutations:{
    setDialogVisible:function(state,value){
      state.dialogVisible = value
    },
    setOrgNameId:function(state,value){
      state.orgNameId = value
    },
    setTypeNameId:function(state,value){
      state.typeNameId = value
    },
    setKeyword:function(state,value){
      state.keyword = value
    },
    setSortType:function(state,value){
      state.sortType = value
    },
    setPageNo:function(state,value){
      state.pageNo = value
    },

  },

}
