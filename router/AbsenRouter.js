const express = require('express')
const router = express.Router()
const AbsenController = require('./../controller/AbsenController')

router.route('/absen')
    .get(AbsenController.dataAbsensi)

router.route('/absen/:kelas_id')
    .get(AbsenController.dataAbsensiKelas)

router.route('/absen/all')
    .get(AbsenController.dataPresensi)

module.exports = router