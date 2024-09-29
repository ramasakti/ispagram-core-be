const express = require('express')
const router = express.Router()
const HariController = require('../controller/HariController')

router.route('/hari')
    .get(HariController.hari)

router.route('/hari/:id_hari')
    .get(HariController.detail)
    .put(HariController.updateHari)

router.route('/jam_khusus/:id')
    .put(HariController.updateJamKhusus)

module.exports = router