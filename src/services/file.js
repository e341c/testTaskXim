const path = require("path")
const fs = require("fs")

function uploadFile(file) {
    const uploadPath = "./files"

    const savePath = path.join(uploadPath, file.originalFilename)
    console.log("Save path is..", savePath);

    fs.rename(file.path, savePath, (err) => {
        if (err) {
            console.log("Error saving file..", err)
        } else {
            console.log("File saved successfully..", savePath)
        }
    })
}

function checkFile(fileName) {
    const uploadPath = "./files"

    const savePath = path.join(uploadPath, fileName)

    if (fs.existsSync(savePath)) {
        return true
    }

    return false
}

function deleteFile(fileName) {
    const uploadPath = "./files"

    const filePath = path.join(uploadPath, fileName)

    fs.unlink(filePath, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log("File deleted successfully")
        }
    })
}

module.exports = { uploadFile, checkFile, deleteFile }
