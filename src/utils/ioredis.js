import Redis from "ioredis";
const redis = new Redis({
    host: 'localhost', // Redis服务器地址
    port: 6379, // Redis服务器端口号
})