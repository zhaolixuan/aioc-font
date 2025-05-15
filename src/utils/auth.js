import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return localStorage.getItem(TokenKey)|| Cookies.get(TokenKey)
}

export function setToken(token) {
  
  return localStorage.setItem(TokenKey,token) || Cookies.set(TokenKey, token)
}

export function removeToken() {
  if (localStorage.getItem(TokenKey)) {
    return localStorage.removeItem(TokenKey)
  }
  return  Cookies.remove(TokenKey)
}
