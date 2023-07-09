
import { createClient } from 'redis'
const port = 6379
const host = '127.0.0.1'
const pwd = 'redis123456'
console.log(createClient);
const client = createClient()
console.log(client);

client.on('ready',function () {
    console.log('ready');
})


client.on('connect',function () {
    console.log('connect');
})



client.on('reconnecting',function () {
    console.log('reconnecting');
})


client.on('end',function () {
    console.log('end');
})


client.on('warning',function () {
    console.log('warning');
})


client.on('error',function () {
    console.log('error');
})

export default client