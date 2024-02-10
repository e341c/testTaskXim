require("dotenv").config()
const jwt = require("jsonwebtoken")
const redisClient = require("../services/redis")

const tokenValidate = async (req, res, next) => {
    const bearertoken = req.headers["bearertoken"]

    if (!bearertoken) return res.status(401).json({ msg: "No token" })

    const revoked = await redisClient.get(bearertoken)
    if (revoked) {
        return res.status(401).json({ msg: "Log in again" })
    }

    try {
        const user = jwt.verify(bearertoken, process.env.SECRET)

        if (!user) return res.status(401).json({ msg: "Wrong token" })

        req.user = user
        await next()
    } catch (error) {
        console.log(error)
        res.status(401).json({msg: error?.message})
    }
}

module.exports = tokenValidate
