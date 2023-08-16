const express = require('express')
const router = express.Router()
const KelasController = require('./../controller/KelasController')

router.route('/kelas')
    .get(KelasController.kelas)
    .post(KelasController.storeKelas)

router.route('/kelas/:kelas_id')
    .get(KelasController.detailKelas)
    .put(KelasController.updateKelas)
    .delete(KelasController.deleteKelas)

module.exports = router