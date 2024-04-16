const express = require('express')
const router = express.Router()
const PembayaranController = require('../controller/PembayaranController')

router.route('/pembayaran')
    .get(PembayaranController.pembayaran)
    .post(PembayaranController.store)

router.route('/pembayaran/:id_pembayaran')
    .put(PembayaranController.update)
    .delete(PembayaranController.destroy)

module.exports = router