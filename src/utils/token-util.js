/**
 * token 操作封装
 */

/**
 * 获取缓存的 token
 */
export function getToken (name) {
    const token = localStorage.getItem(name);
    if (!token) {
        return sessionStorage.getItem(name);
    }
    return token;
}

/**
 * 缓存 token
 * @param token token
 * @param remember 是否永久存储
 */
export function setToken (token, remember) {
    removeToken();
    if (token) {
        if (remember) {
            localStorage.setItem('access_token', token);
        } else {
            sessionStorage.setItem('access_token', token);
        }
    }
}

/**
 * 移除 token
 */
export function removeToken () {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
}