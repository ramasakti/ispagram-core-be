const express = require('express')
const router = express.Router()
const HariController = require('./../controller/HariController')

router.route('/hari')
    .get(HariController.hari)

router.route('/hari/:id_hari')
    .put(HariController.updateHari)

module.exports = router