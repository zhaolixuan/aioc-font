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
      method: "GET"
    });
  },

  // 模块状态接口
  sysStatusList() {
    return request({
      url: "/bussiness/sysStatus/list",
      method: "GET"
    });
  },

  // 报警记录接口
  alarmList() {
    return request({
      url: "/bussiness/alarm/list",
      method: "GET"
    });
  },
  // 通道管理接口
  channelList() {
    return request({
      url: "/bussiness/channel/list",
      method: "GET"
    });
  },
  // 警告统计接口
  alarmStatisticsList() {
    return request({
      url: "/bussiness/alarmStatistics/list",
      method: "GET"
    });
  },

  // 外设管理接口
  aideDeviceList() {
    return request({
      url: "/bussiness/aideDevice/list",
      method: "GET"
    });
  },
  // 主机管理接口
  hostManageList() {
    return request({
      url: "/bussiness/hostManage/list",
      method: "GET"
    });
  },

  // 分区管理接口
  zoneList() {
    return request({
      url: "/bussiness/zone/list",
      method: "GET"
    });
  },

  // 警告类型接口
  alarmTypeList() {
    return request({
      url: "/bussiness/alarmType/list",
      method: "GET"
    });
  }
};
