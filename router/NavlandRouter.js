const express = require('express')
const router = express.Router()
const NavlandController = require('../controller/NavlandController')

router.route('/navland')
    .get(NavlandController.navland)
    .post(NavlandController.store)

router.route('/navland/:navland')
    .put(NavlandController.update)
    .delete(NavlandController.destroy)

module.exports = router