const express = require('express')
const router = express.Router()
const NavbarController = require('../controller/NavbarController')
const middleware = require('../utilities/Middleware')

router.route('/navbar/:role')
    .get(NavbarController.navbar)
    .put(NavbarController.update)

module.exports = router