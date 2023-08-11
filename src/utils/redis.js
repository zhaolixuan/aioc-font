import axios from "axios";


export const setRedisData = (data) => {
    return new Promise((resolve, reject) => {
        console.log('data',data);
        axios({
            url:'/api/redis/set',
            method:'post',
            params:data
        }).then(value => {
            resolve(value)
        }).catch(e => {
            reject(e)
        })
    })

}

export const getRedisData = (key) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/api/redis/get',
            method: 'get',
            params:{
                key
            }
        }).then(value => {
            resolve(value)
        }).catch(e => {
            reject(e)
        })
    })

}


export const lpopRedisData = (key) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/api/redis/lpop',
            method: 'get',
            params:{
                listKey:key
            }
        }).then(value => {
            resolve(value)
        }).catch(e => {
            reject(e)
        })
    })

}
