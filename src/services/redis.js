require("dotenv").config()
const redis = require("redis")

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
})

redisClient.on("connect", () => {
    console.log("Connected to redis server")
})

redisClient.on("error", (err) => {
    console.log("Error connecting to redis server..", err)
})

module.exports = redisClient
