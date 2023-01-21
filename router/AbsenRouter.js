const express = require('express')
const router = express.Router()
const AbsenController = require('./../controller/AbsenController')

router.route('/absen')
    .get(AbsenController.dataAbsensi)

router.route('/present')
    .get(AbsenController.dataPresensi)

module.exports = router