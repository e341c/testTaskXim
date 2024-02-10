const express = require("express")
const authRouter = require("./authRoutes")
const fileRouter = require("./fileRoutes")

const router = express.Router()

router.use(authRouter)
router.use(fileRouter)

module.exports = router
