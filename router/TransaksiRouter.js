const express = require('express')
const router = express.Router()
const TransaksiController = require('./../controller/TransaksiController')

router.route('/transaksi')
    .get(TransaksiController.dataTransaksi)
    .post(TransaksiController.transaksi)

router.route('/tagihan/:id_siswa')
    .get(TransaksiController.detailTagihan)

router.route('/trx/:kwitansi')
    .get(TransaksiController.detailTransaksi)

module.exports = router