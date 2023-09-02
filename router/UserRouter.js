const express = require('express')
const router = express.Router()
const UserController = require('./../controller/UserController')

const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })

router.route('/users')
    .get(UserController.users)

router.route('/user/:username')
    .get(UserController.detailUser)
    .put(upload.single('avatar'), UserController.updateUser)

router.route('/reset')
    .post(UserController.forgetPassword)

module.exports = router