/** sso跳转登录页域名配置文件 */
let domain = ''

if (process.env.NODE_ENV === 'development') {
  domain = 'http://devcity.jdcloud.com'
} else if (process.env.NODE_ENV === 'production') {
  domain = 'http://devcity.jdcloud.com'
}

export default domain
