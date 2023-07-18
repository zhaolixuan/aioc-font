/** 接口统一管理 */
import request from './request'

export default {
  /** 领导驾驶舱接口 */
  // 获取总览指标数据
  getAllViewData (params) {
    return request('post', '/api/wholeNetworkJiujiangIndex/getIndexData', params, 'json')
  },
  // 获取重点企业和店铺TOP20
  getComPanyAndShopList (params) {
    return request('post', '/api/wholeNetworkJiujiangEntInfo/getEntAndTopList', params, 'json')
  },


  // 验证gunsToken
  checkoutGunsToken (params) {
    return request('get', '/aioc-api/verify/token', params)
  },
  // 获取地图区县指标
  getWholeNetworkJiujiangIndexList (params) {
    return request('post', '/api/wholeNetworkJiujiangIndex/getList', params, 'json')
  },
  getfindListByTimeList(params) {
    return request('get', '/api/nachangMap/findListByTime', params, 'json')
  },

  getShangRaofindListByTimeList(params) {
    return request('get', '/api/nachangMap/findShangRaoList', params, 'json')
  }
}
