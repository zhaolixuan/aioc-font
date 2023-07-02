/*
 * @Author: diaolili
 * @Date: 2020-12-03 12:06:57
 * @Description: 登录等通用功能接口
 */
import fetches from './fetches'

/**
 * post 用户登录
 */
export const login = data => {
  return fetches({
    method: 'POST',
    url: '/user/login'
  })
}

/**
 * get 获取用户信息
 */
export const getUserInfo = params => {
  return fetches({
    method: 'GET',
    url: '/user/getUserInfo',
    params
  })
}

/**
 * get 获取菜单
 */
export const getMenuData = data => {
  return fetches({
    method: 'POST',
    url: '/common/getCommonData/HQYHCDAN',
    data
  })
}