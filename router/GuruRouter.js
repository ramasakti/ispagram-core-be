const express = require('express')
const router = express.Router()
const GuruController = require('./../controller/GuruController')

router.route('/guru')
    .get(GuruController.guru)

module.exports = router