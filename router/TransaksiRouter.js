const express = require('express')
const router = express.Router()
const TransaksiController = require('../controller/TransaksiController')

router.route('/transaksi')
    .get(TransaksiController.dataTransaksi)
    .post(TransaksiController.transaksi)

router.route('/transaksi/:id_siswa')
    .get(TransaksiController.transaksiSiswa)

router.route('/tagihan/siswa/:id_siswa')
    .get(TransaksiController.tagihan)

router.route('/trx/:kwitansi')
    .get(TransaksiController.detail)

router.route('/tagihan/siswa')
    .post(TransaksiController.detailTagihan)

module.exports = router