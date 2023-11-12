const express = require('express')
const router = express.Router()
const BiodataController = require('./../controller/BiodataController')

router.route('/biodata/:username')
    .get(BiodataController.biodata)

module.exports = router