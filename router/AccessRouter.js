const express = require('express')
const router = express.Router()
const AccessController = require('../Controller/AccessController')

router.route('/access/:role')
    .get(AccessController.access)

module.exports = router