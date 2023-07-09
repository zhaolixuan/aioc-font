const redisClient = require('./redis')
console.log(redisClient);
// export function set(key, value, expire) {
//     return new Promise((resolve, reject) => {
//         redisClient.set(key, value, function (err, result) {
//             if (err) {
//                 reject(err)
//             }
//             if (!isNaN(expire) && expire > 0) {
//                 redisClient.expire(key, parseInt(expire))
//             }
//             resolve(result)
//         })
//     })
// }

// export function get(key) {
//     return new Promise((resolve, reject) => {
//         redisClient.get(key, function (err, result) {
//             if (err) {
//                 reject(err)
//             }
//             resolve(result)
//         })
//     })
// }


// export function remove(key) {
//     return new Promise((resolve, reject) => {
//         redisClient.remove(key, function (err, result) {
//             if (err) {
//                 reject(err)
//             }
//             redisClient.expire(key, parseInt(-1))
//             resolve(result)
//         })
//     })
// }



