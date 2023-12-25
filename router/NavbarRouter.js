const express = require('express')
const router = express.Router()
const NavbarController = require('../controller/NavbarController')

router.route('/navbar/:role')
    .get(NavbarController.navbar)
    .put(NavbarController.update)

module.exports = router