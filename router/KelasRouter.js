const express = require('express')
const router = express.Router()
const KelasController = require('../controller/KelasController')

router.route('/kelas')
    .get(KelasController.kelas)
    .post(KelasController.store)

router.route('/kelas/:kelas_id')
    .get(KelasController.detail)
    .put(KelasController.update)
    .delete(KelasController.destroy)

router.route('/kelas/graduate')
    .post(KelasController.graduate)

router.route('/tunggakan')
    .get(KelasController.getTunggakanSiswaAktif)

module.exports = router