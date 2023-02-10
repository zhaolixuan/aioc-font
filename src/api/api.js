/** 接口统一管理 */
import fetches from './fetches'

export default {
  /** 领导驾驶舱接口 */
  // 获取总览指标数据
  getAllViewData (params) {
    return fetches('post', '/api/wholeNetworkJiujiangIndex/getIndexData', params, 'json')
  },
  // 获取重点企业和店铺TOP20
  getComPanyAndShopList (params) {
    return fetches('post', '/api/wholeNetworkJiujiangEntInfo/getEntAndTopList', params, 'json')
  },
  /** Consume **/
  getPoi () {
    return fetches('get', '../../static/data/index_poi.json')
  },

  // 验证gunsToken
  checkoutGunsToken (params) {
    return fetches('get', '/aioc-api/verify/token', params)
  },
  // 获取地图区县指标
  getWholeNetworkJiujiangIndexList (params) {
    return fetches('post', '/api/wholeNetworkJiujiangIndex/getList', params, 'json')
  },
  getfindListByTimeList(params) {
    return fetches('get', '/api/nachangMap/findListByTime', params, 'json')
  },

  getShangRaofindListByTimeList(params) {
    return fetches('get', '/api/nachangMap/findShangRaoList', params, 'json')
  }
}
