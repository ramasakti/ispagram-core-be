const express = require('express')
const router = express.Router()
const DashboardController = require('../controller/DashboardController')

router.route('/data/sgk')
    .get(DashboardController.dataSiswaGuruKelas)

router.route('/chart/absen-siswa/harian')
    .get(DashboardController.diagramAbsenHarianSiswa)

router.route('/chart/absen-siswa/mingguan')
    .get(DashboardController.grafikAbsenMingguanSiswa)

router.route('/chart/keuangan')
    .get(DashboardController.grafikKeuangan)

module.exports = router