const express = require('express')
const router = express.Router()
const RuangController = require('../controller/RuangController')

router.route('/ruang')
    .get(RuangController.ruang)
    .post(RuangController.store)

router.route('/ruang/:id_ruang')
    .put(RuangController.update)
    .delete(RuangController.destroy)

module.exports = router