const File = require("../models/file")
const { uploadFile, checkFile, deleteFile } = require("../services/file")
const fs = require("fs")
const path = require("path")

const file = {}

file.all = async (req, res) => {
    try {
        const files = await File.findAll()
        res.status(200).json(files)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

file.one = async (req, res) => {
    const id = parseInt(req.params?.id)
    if (!id) return res.status(400).json({ msg: "No id provided" })

    try {
        const file = await File.findOne({ where: { id } })

        if (!file) return res.status(404).json({ msg: "Not found" })

        res.status(200).json(file?.dataValues)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

file.upload = async (req, res) => {
    const file = req.files.file
    if (!file) return res.status(400).json({ msg: "No file provided" })

    try {
        const fileExists = checkFile(file.originalFilename)
        if (fileExists) return res.status(400).json({ msg: "File with this name already exists" })

        uploadFile(file)

        const filename = file.originalFilename.replace(/\.[^.]+$/, "")

        const ext = file.originalFilename.slice(((file.originalFilename.lastIndexOf(".") - 1) >>> 0) + 2)

        const newFile = await File.create({
            name: filename,
            extension: ext,
            mime_type: file.type,
            size: file.size,
        })

        res.status(200).json(newFile)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

file.download = async (req, res) => {
    const id = parseInt(req.params?.id)
    if (!id) return res.status(400).json({ msg: "No id provided" })

    try {
        const file = await File.findOne({ where: { id } })

        if (!file) return res.status(404).json({ msg: "Not found" })
        const fileNameServer = file.dataValues.name + "." + file.dataValues.extension
        const filePath = path.join("files", fileNameServer)

        const fileExists = checkFile(fileNameServer)
        if (!fileExists) return res.status(400).json({ msg: "File does not exist on server" })

        res.contentType("application/octet-stream")
        res.download(filePath, fileNameServer)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

file.update = async (req, res) => {
    const id = parseInt(req.params?.id)
    if (!id) return res.status(400).json({ msg: "No id provided" })

    const newFile = req.files.file
    if (!newFile) return res.status(400).json({ msg: "No file provided" })

    try {
        const file = await File.findOne({ where: { id } })
        if (!file) return res.status(404).json({ msg: "Not found" })

        const fileNameServer = file.dataValues.name + "." + file.dataValues.extension
        const fileExists = checkFile(fileNameServer)
        if (!fileExists) return res.status(400).json({ msg: "File does not exist on server" })

        deleteFile(fileNameServer)
        uploadFile(newFile)

        const newFileName = newFile.originalFilename.replace(/\.[^.]+$/, "")
        const newFileExt = newFile.originalFilename.slice(((newFile.originalFilename.lastIndexOf(".") - 1) >>> 0) + 2)

        file.set({
            name: newFileName,
            extension: newFileExt,
            mime_type: newFile.type,
            size: newFile.size,
            updatedAt: new Date(),
        })

        await file.save()

        res.status(200).json(file)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

file.delete = async (req, res) => {
    const id = parseInt(req.params?.id)
    if (!id) return res.status(400).json({ msg: "No id provided" })

    try {
        const file = await File.findOne({ where: { id } })
        if (!file) return res.status(404).json({ msg: "Not found" })

        const fileNameServer = file.dataValues.name + "." + file.dataValues.extension
        deleteFile(fileNameServer)

        await File.destroy({ where: { id } })

        res.status(200).json({ msg: "ok" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

module.exports = file
