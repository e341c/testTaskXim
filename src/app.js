"use strict"
require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const router = require("./routes/indexRoutes")
const formData = require("express-form-data")
// const helmet = require("helmet")

const app = express()
const PORT = process.env.PORT || 7000

function createServer() {
    app.use(cors({ origin: true }))
    // app.use(helmet())
    app.use(formData.parse())
    // app.use(formData.format())
    // app.use(formData.stream())
    app.use(formData.union())
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    // app.use(express.static("files"))

    app.use(router)

    app.listen(PORT, () => {
        console.log(`Server listnening on port ${PORT}`)
    })
}

module.exports = createServer
