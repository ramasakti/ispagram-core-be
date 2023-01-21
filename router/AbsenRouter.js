const express = require('express')
const router = express.Router()
const AbsenController = require('./../controller/AbsenController')

router.route('/absen')
    .get(AbsenController.AbsenSiswa)

module.exports = router