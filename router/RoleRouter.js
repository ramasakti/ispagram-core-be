const express = require('express')
const router = express.Router()
const RoleController = require('../controller/RoleController')

router.route('/role')
    .get(RoleController.role)

router.route('/role/:role')
    .get(RoleController.detail)

module.exports = router