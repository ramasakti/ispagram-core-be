const express = require('express')
const router = express.Router()
const AuthController = require('../Controller/AuthController')

router.route('/auth')
    .post(AuthController.auth)

router.route('/protected')
    .get(AuthController.middleware, AuthController.protected)

router.route('/valid')
    .get(AuthController.listValidToken)

module.exports = router