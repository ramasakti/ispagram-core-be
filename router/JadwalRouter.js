const express = require('express')
const router = express.Router()
const JadwalController = require('../Controller/JadwalController')

router.route('/jadwal')
    .get(JadwalController.jadwal)
    .post(JadwalController.storeJadwal)

router.route('/jadwal/:id_jadwal')
    .get(JadwalController.jadwalGrup)
    .put(JadwalController.updateJadwal)
    .delete(JadwalController.deleteJadwal)

module.exports = router