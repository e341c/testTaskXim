const createServer = require("./src/app");
const redisClient = require("./src/services/redis");



createServer()
redisClient.connect()