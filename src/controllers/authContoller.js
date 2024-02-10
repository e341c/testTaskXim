const User = require("../models/user")
const redisClient = require("../services/redis")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const signUp = async (req, res) => {
    const { id, password } = req.body
    if (!id || !password) return res.status(400).json({ msg: "Not all fields provided" })

    try {
        const user = await User.findOne({ where: { id } })
        if (user) return res.status(400).json({ msg: "User already exists" })

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({ id, password: hashedPassword })

        res.status(201).json(newUser)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

const signIn = async (req, res) => {
    const { id, password } = req.body
    if (!id || !password) return res.status(400).json({ msg: "Not all fields provided" })

    try {
        const user = await User.findOne({ where: { id } })

        if (!user) {
            return res.status(401).json({ msg: "No such user" })
        }

        const hashedPassword = user.dataValues.password

        const compared = await bcrypt.compare(password, hashedPassword)

        if (!compared) {
            return res.status(401).json("Wrong password")
        }

        const bearertoken = jwt.sign({ id: user.dataValues.id }, process.env.SECRET, { expiresIn: "10m" })
        const refreshtoken = jwt.sign({ id: user.dataValues.id }, process.env.REFRESH_SECRET, { expiresIn: "30d" })

        res.status(201).json({ bearertoken, refreshtoken })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

const refresh = async (req, res) => {
    const refreshtoken = req.headers["refreshtoken"]
    if (!refreshtoken) return res.status(401).json("No refresh token")

    try {
        const revoked = await redisClient.get(refreshtoken)
        if (revoked) {
            return res.status(401).json({ msg: "Log in again" })
        }

        const decoded = jwt.verify(refreshtoken, process.env.REFRESH_SECRET)
        console.log(decoded)

        const bearertoken = jwt.sign({ id: decoded.id }, process.env.SECRET, { expiresIn: "10m" })

        res.status(201).json({ bearertoken })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

const info = async (req, res) => {
    const user = req.user

    try {
        res.status(201).json({ id: user.id })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

const logout = async (req, res) => {
    const tokens = [
        { token: req.headers["bearertoken"], type: "bearertoken" },
        { token: req.headers["refreshtoken"], type: "refreshtoken" },
    ]

    if (!tokens[0].token || !tokens[1].token) return res.status(401).json({ msg: "Not all tokens provided" })

    try {
        tokens.forEach((tokenObj) => {
            console.log(tokenObj.type)
            jwt.verify(
                tokenObj.token,
                tokenObj.type == "refreshtoken" ? process.env.REFRESH_SECRET : process.env.SECRET,
                (err, decoded) => {
                    if (err) console.log(err)
                    if (decoded) {
                        const expirationTime = decoded.exp - Math.floor(Date.now() / 1000)
                        redisClient.setEx(tokenObj.token, expirationTime, "revoked")
                    }
                }
            )
        })

        res.status(201).json({ msg: "Logout" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

module.exports = {
    signUp,
    signIn,
    refresh,
    info,
    logout,
}
