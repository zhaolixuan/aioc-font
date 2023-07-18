/** axios封装 */
import axios from 'axios'

// 环境的切换
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://192.168.196.37:8080/'
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
axios.defaults.headers.Authorization= `Bearer eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6IjEzZGQ3NGVkLWIxMTAtNGRlNy04NTRkLWVlZmM4Y2YyNTI4MCJ9.hPf8CZ_Nb16YliNhECOC4E6HhBePdrnRk3PGq64qDKn8WPeHkFS9zEnK7KCjKCvFzbhBIkNvqf2aLZzJxRYd-w`
axios.defaults.headers['Content-Type']= `application/json`

export default axios
