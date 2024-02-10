const express = require("express")
const { signUp, signIn, info, logout, refresh } = require("../controllers/authContoller")
const tokenValidate = require("../middleware/tokenValidate")
const authRouter = express.Router()

authRouter.post("/signup", signUp)
    .post("/signin", signIn)
    .post("/signin/new_token", refresh)
    .get("/info", tokenValidate, info)
    .get("/logout", logout)

module.exports = authRouter
