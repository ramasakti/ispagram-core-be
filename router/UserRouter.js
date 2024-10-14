const express = require('express')
const router = express.Router()
const UserController = require('../controller/UserController')

const multer = require('multer')
const path = require('path')
const os = require('os')

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
    .put(upload.single('avatar'), UserController.update)

router.route('/reset')
    .post(UserController.forgetPassword)

module.exports = router