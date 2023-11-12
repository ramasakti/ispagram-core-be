const express = require('express')
const router = express.Router()
const AbsenController = require('./../controller/AbsenController')

router.route('/absen')
    .get(AbsenController.dataAbsensi)

router.route('/absen/:id_siswa')
    .put(AbsenController.updateAbsen)

router.route('/absen/:kelas_id')
    .get(AbsenController.dataAbsensiKelas)

router.route('/absen/all')
    .get(AbsenController.dataPresensi)

router.route('/absen/engine')
    .put(AbsenController.engineAbsenSiswa)

router.route('/absen/data/kehadiran')
    .get(AbsenController.diagramHadir)

router.route('/absen/data/keterlambatan')
    .get(AbsenController.diagramTerlambat)

router.route('/absen/data/sakit')
    .get(AbsenController.diagramSakit)

router.route('/absen/data/izin')
    .get(AbsenController.diagramIzin)

router.route('/absen/data/alfa')
    .get(AbsenController.diagramAlfa)

router.route('/absen/data/grafik')
    .get(AbsenController.grafikMingguan)

router.route('/rekap')
    .get(AbsenController.rekap)

router.route('/absen/wa/:id_siswa')
    .get(AbsenController.dataWA)

router.route('/absen/individu/:id_siswa')
    .get(AbsenController.diagramIndividu)

module.exports = router