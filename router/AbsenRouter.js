const express = require('express')
const router = express.Router()
const AbsenController = require('../controller/AbsenController')
const AbsenStafController = require('../controller/AbsenStafController')

router.route('/absen')
    .get(AbsenController.dataAbsensi)

router.route('/absen/siswa/:id_siswa')
    .put(AbsenController.update)

router.route('/absen/kelas/:kelas_id')
    .get(AbsenController.dataAbsensiKelas)

router.route('/absen/all')
    .get(AbsenController.dataAllAbsensiSiswa)

router.route('/absen/terlambat')
    .get(AbsenController.dataTerlambat)

router.route('/absen/data/harian')
    .get(AbsenController.diagramHarian)

router.route('/absen/data/mingguan')
    .get(AbsenController.grafikMingguan)

router.route('/rekap')
    .get(AbsenController.rekap)

router.route('/absen/wa/:id_siswa')
    .get(AbsenController.dataWA)

router.route('/absen/individu/:id_siswa')
    .get(AbsenController.diagramIndividu)

router.route('/absen/reset')
    .post(AbsenController.resetAbsenHarian)

router.route('/absen/staf')
    .get(AbsenStafController.rekap)

router.route('/absen/staf/:id_siswa')
    .post(AbsenStafController.store)

module.exports = router