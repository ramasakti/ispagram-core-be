const express = require('express')
const router = express.Router()
const AuthController = require('./../controller/AuthController')

router.route('/auth')
    .get(AuthController.auth)

module.exports = router