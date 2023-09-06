const express = require('express')
const router = express.Router()
const PembayaranController = require('./../controller/PembayaranController')

router.route('/pembayaran')
    .get(PembayaranController.pembayaran)
    .post(PembayaranController.storePembayaran)

router.route('/pembayaran/:id_pembayaran')
    .put(PembayaranController.updatePembayaran)
    .delete(PembayaranController.deletePembayaran)

module.exports = router