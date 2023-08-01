const express = require('express')
const router = express.Router()
const KelasController = require('./../controller/KelasController')

router.route('/kelas')
    .get(KelasController.kelas)

router.route('/kelas/:kelas_id')
    .get(KelasController.detailKelas)