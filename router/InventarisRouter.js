const express = require('express')
const router = express.Router()
const InventarisController = require('../controller/InventarisController')

router.route('/inventaris')
    .get(InventarisController.inventaris)
    .post(InventarisController.store)

router.route('/inventaris/:id_inventaris')
    .put(InventarisController.update)
    .delete(InventarisController.destroy)

router.route('/inventaris/ruang/:id_ruang')
    .get(InventarisController.inventarisRuang)

module.exports = router