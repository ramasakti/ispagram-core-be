const express = require('express')
const router = express.Router()
const JadwalController = require('../controller/JadwalController')

router.route('/jadwal')
    .get(JadwalController.jadwal)
    .post(JadwalController.store)

router.route('/jadwal/:id_jadwal')
    .get(JadwalController.jadwalGrup)
    .put(JadwalController.update)
    .delete(JadwalController.destroy)

router.route('/jadwal/template/excel')
    .get(JadwalController.exportExcel)

router.route('/jadwal/import/excel')
    .post(JadwalController.importExcel)

module.exports = router