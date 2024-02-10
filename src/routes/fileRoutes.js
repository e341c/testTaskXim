const express = require("express")
const tokenValidate = require("../middleware/tokenValidate")
const file = require("../controllers/fileController")
const {upload} = require("../services/file")
const router = express.Router()
const fileRouter = express.Router()

router
    .post("/upload", tokenValidate, file.upload)
    .get("/list", tokenValidate, file.all)
    .delete("/delete/:id", tokenValidate, file.delete)
    .get("/:id", tokenValidate, file.one)
    .get("/download/:id", tokenValidate, file.download)
    .put("/update/:id", tokenValidate, file.update)

fileRouter.use("/file", router)
module.exports = fileRouter
