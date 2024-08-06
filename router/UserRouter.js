const express = require('express')
const router = express.Router()
const UserController = require('../controller/UserController')

const multer = require('multer')
const path = require('path')
const os = require('os')
const fs = require('fs')
const { uploadFileToFTP } = require('../utilities/FTP')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const tempDir = os.tmpdir()
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })

// router.route('/recognition')
//     .post(UserController.recognition)

router.route('/users')
    .get(UserController.users)
    .post(UserController.store)

router.route('/user/:username')
    .get(UserController.detail)
    .put(upload.single('avatar'), async (req, res, next) => {
        if (req.file) {
            const localFilePath = req.file.path
            const remoteFilePath = `/${req.file.filename}`
            await uploadFileToFTP(localFilePath, remoteFilePath)
            req.file.path = remoteFilePath // Update file path to remote path
            fs.unlinkSync(localFilePath) // Delete local file after upload
        }
        next()
    }, UserController.update)

router.route('/reset')
    .post(UserController.forgetPassword)

module.exports = router