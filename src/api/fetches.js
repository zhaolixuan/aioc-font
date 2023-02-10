/** 阉割版fetch，直接返回接口返回的数据 */
import axios from './http'
import qs from 'qs'

// contentType：post请求头，默认为form格式，可选'json'设置为json格式，支持其他格式
export default function fetch (method = 'GET', url, params = {}, contentType) {
  let options = {
    url: url,
    method: method,
    params: params
  }
  if (method.toLocaleLowerCase() === 'post') {
    options = {
      url: url,
      method: method,
      data: qs.stringify(params)
    }
    if (contentType) {
      let type = contentType === 'json' ? 'application/json;charset=UTF-8' : contentType
      options.headers = {
        'Content-Type': type
      }
      options.data = params
    }
  }
  return new Promise((resolve, reject) => {
    axios(options).then(res => {
      if (res.status === 200 && res.data) {
        resolve(res.data)
      } else {
        reject('接口返回数据有误！')
      }
    }).catch(error => {
      reject(error)
    })
  })
}
