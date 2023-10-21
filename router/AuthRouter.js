const express = require('express')
const router = express.Router()
const AuthController = require('./../controller/AuthController')

router.route('/auth')
    .post(AuthController.auth)

router.route('/protected')
    .get(AuthController.middleware, AuthController.protected)

module.exports = router