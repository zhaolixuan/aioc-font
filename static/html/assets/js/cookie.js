/**********************************
 * Description: by IntelliJ IDEA.
 * Author: diaolili
 * Date: 2019/3/16 15:00
 * Example:
 ***********************************/
(function () {
  let oToken = getCookie('gunsToken')
  if (!oToken) {
    let url = window.location.href
    window.location.href = GLOBAL_LOGIN + '/sso/?redirectUrl=' + url
  }
})()
// 写cookies
function setCookie (name, value) {
  let minute = 30
  let exp = new Date()
  exp.setTime(exp.getTime() + minute * 60 * 1000)
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
}

// 读取cookies
function getCookie (name) {
  let arr
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')

  if (arr = document.cookie.match(reg)) { return unescape(arr[2]) } else { return null }
}

// 删除cookies
function delCookie (name) {
  let exp = new Date()
  exp.setTime(exp.getTime() - 1)
  let cval = getCookie(name)

  if (cval != null) {
    document.cookie = name + '=;expires=' + exp.toGMTString() +';path=/';
    document.cookie = name + '=;expires=' + exp.toGMTString() +';path=/;domain=.jdcloud.com';
    }

}

// 获取URL参数值
function getUrlParam (name) { /* ?videoId=identification  */
  let params = decodeURI(window.location.search) /* 截取？号后面的部分    index.html?act=doctor,截取后的字符串就是?act=doctor  */
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  let r = params.substr(1).match(reg)
  if (r != null) return unescape(r[2]); return null
}

function goToLogin () {
  var url = document.location.href
  url = url.split('?')[0]
  document.location.href = GLOBAL_LOGIN + '/sso/?redirectUrl=' + url
}
