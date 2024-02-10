"use strict"
require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const router = require("./routes/indexRoutes")
const formData = require("express-form-data")

const app = express()
const PORT = process.env.PORT || 7000

function createServer() {
    app.use(cors({ origin: true }))
    app.use(formData.parse())
    app.use(formData.union())
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    app.use(router)

    app.listen(PORT, () => {
        console.log(`Server listnening on port ${PORT}`)
    })
}

module.exports = createServer
