const express = require('express')
const router = express.Router()
const LoginController = require('./../controller/LoginController')

router.route('/auth')
    .get(LoginController.auth)

module.exports = router