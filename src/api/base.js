import axios from 'axios'

export function fetch (url, options) {
  const opts = options || {}
  return new Promise((resolve, reject) => {
    const opt = {
      url: url,
      method: opts.method || 'get',
      withCredentials: true,
      headers: opts.headers ? opts.headers : opts.method !== 'get' ? { 'Content-Type': 'application/json;' } : {'Content-Type': 'application/x-www-form-urlencoded;'}
    }

    if (opt.method === 'get') {
      opt.params = options.data || ''
    } else {
      opt.data = options.data || ''
    }
    axios(opt).then(res => {
      resolve(res.data)
    }).catch(error => {
      reject(error)
    })
  })
};
