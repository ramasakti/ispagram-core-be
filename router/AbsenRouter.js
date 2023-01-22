const express = require('express')
const router = express.Router()
const AbsenController = require('./../controller/AbsenController')

router.route('/absen/')
    .get(AbsenController.dataAbsensi)

router.route('/absen/all')
    .get(AbsenController.dataPresensi)

router.route('/absen/update')
    .put(AbsenController.updateAbsen)

router.route('/absen/reset')
    .delete(AbsenController.resetRekap)

router.route('/absen/engine')
    .put(AbsenController.engine)

module.exports = router