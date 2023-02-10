/** axios封装 */
import axios from 'axios'

// 环境的切换
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://jiujiang-cloud.xjoycity.com/'
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = window.location.origin
}
console.log(process.env.NODE_ENV);
// axios.defaults.baseURL = '/'
// axios.defaults.baseURL = 'http://dev.xjoycity.com:8080'
// 请求超时时间
axios.defaults.timeout = 10000

// 允许携带cookie
axios.defaults.withCredentials = true

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

export default axios
