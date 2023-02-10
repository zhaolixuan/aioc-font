export default {
  state: {
    //tablebox
    showBox: false,
    tableType:1, //1:设备，2:资源
    type:'', //具体类型

    //故障设备坐标
    positionList: {
      type: 1, // 1:设备（路灯），2：资源（停车场）
      list: [{x: 0, y: 1}] // 坐标数组
    },
    
  },
  mutations: {
    setShowBox: function (state, value) {
      state.showBox = value
    },
    setTableType: function (state, value) {
      state.tableType = value
    },
    setType: function (state, value) {
      state.type = value
    },
    setPositionList: function (state, value) {
      state.positionList = value
    }
  }
}
