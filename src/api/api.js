/** 接口统一管理 */
import request from "./request";

export default {
  /** 领导驾驶舱接口 */
  // 获取总览指标数据
  getAllViewData(data) {
    return request({
      url: "/login",
      method: "post",
      data
    });
  },
  // 获取重点企业和店铺TOP20
  getComPanyAndShopList(params) {
    return request(
      "post",
      "/api/wholeNetworkJiujiangEntInfo/getEntAndTopList",
      params,
      "json"
    );
  },

  // 验证gunsToken
  checkoutGunsToken(params) {
    return request("get", "/aioc-api/verify/token", params);
  },
  // 获取地图区县指标
  getWholeNetworkJiujiangIndexList(params) {
    return request(
      "post",
      "/api/wholeNetworkJiujiangIndex/getList",
      params,
      "json"
    );
  },
  getfindListByTimeList(params) {
    return request("get", "/api/nachangMap/findListByTime", params, "json");
  },

  getShangRaofindListByTimeList(params) {
    return request("get", "/api/nachangMap/findShangRaoList", params, "json");
  },

  // 主机_渠道_分区信息管理接口
  optionSelect() {
    return request({
      url: "/bussiness/hostToZoneLine/optionSelect",
      method: "get"
    });
  },
  // 模块状态接口
  sysStatusList() {
    return request({
      url: "/bussiness/sysStatus/list",
      method: "get"
    });
  },

  // 报警记录接口
  alarmList(params) {
    return request({
      url: "/bussiness/alarm/list",
      method: "get",
      params
    });
  },
  // 通道管理接口
  channelList() {
    return request({
      url: "/bussiness/channel/list",
      method: "get"
    });
  },
  // 警告统计接口
  alarmStatisticsList() {
    return request({
      url: "/bussiness/alarmStatistics/list",
      method: "get"
    });
  },
  alarmRealTimeData(query) {
    return request({
      url: "/bussiness/alarmRealTimeData/list",
      method: "get",
      params: query
    });
  },


  // 外设管理接口
  aideDeviceList() {
    return request({
      url: "/bussiness/aideDevice/list",
      method: "get"
    });
  },
  // 主机管理接口
  hostManageList() {
    return request({
      url: "/bussiness/hostManage/list",
      method: "get"
    });
  },

  // 分区管理接口
  zoneList() {
    return request({
      url: "/bussiness/zone/list",
      method: "get"
    });
  },

  // 警告类型接口
  alarmTypeList() {
    return request({
      url: "/bussiness/alarmType/list",
      method: "get"
    });
  },
  // 查询警告类型列表,参数为字符串而不是一个对象。
  optionsAlarmType() {
    return request({
      url: '/bussiness/alarmType/optionsAlarmType/biz_alarm_type',
      method: 'get'
    })
  },

  optionsAlarmCategory() {
    return request({
      url: '/bussiness/alarmType/optionsAlarmType/biz_alarm_type_3',
      method: 'get'
    })
  },
  // 查询系统状态列表
  listSysStatus() {
    return request({
      url: '/bussiness/sysStatus/list',
      method: 'get',
    })
  },
  // 获取服务信息
  getServer() {
    return request({
      url: '/monitor/server',
      method: 'get'
    })
  },
  // 查询传感器列表
  sensorList() {
    return request({
      url: '/bussiness/sensor/list',
      method: 'get'
    })
  },
  // 查询管道线信息列表
  listPipleLine() {
    return request({
      url: '/bussiness/hostToZoneLine/optionSelect',
      method: 'get'
    })
  },
  // 开启推流
  startTranscode(params) {
    return request({
      url: '/hikCamera/startTranscode',
      method: 'get',
      params
    })
  },
  // 结束推流
  stopRtmp(params) {
    return request({
      url: '/hikCamera/stopRtmp',
      method: 'get',
      params
    })
  },


  // 方向控制
  actionControl(params) {
    return request({
      url: '/hikCamera/actionControl',
      method: 'get',
      params
    })
  },

  // 拍照
  catchPic(params) {
    return request({
      url: '/gbcamera/catchPicForFlow',
      method: 'get',
      params
    })
  },



  // 摄像头列表
  cameraList(params) {
    return request({
      url: '/bussiness/hostToZoneLine/camera',
      method: 'get',
      params
    })
  },

  updateAlarm(data) {
    return request({
      url: '/bussiness/alarm',
      method: 'put',
      data: data
    })
  },

  realTimeData(params) {
    return request({
      url: '/sensor/realTimeData',
      method: 'get',
      params: params
    })
  },



  systemconfig() {
    return request({
      url: 'system/config/103',
      method: 'get',
    })
  },

  systemconfig() {
    return request({
      url: 'system/config/103',
      method: 'get',
    })
  },





};



