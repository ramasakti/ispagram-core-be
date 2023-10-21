const express = require('express')
const router = express.Router()
const TransaksiController = require('./../controller/TransaksiController')

router.route('/transaksi')
    .get(TransaksiController.dataTransaksi)
    .post(TransaksiController.transaksi)

router.route('/tagihan/kelas/:id_siswa')
    .get(TransaksiController.detailTagihanKelas)

router.route('/trx/:kwitansi')
    .get(TransaksiController.detailTransaksi)

router.route('/tagihan/siswa')
    .post(TransaksiController.detailTagihanSiswa)

module.exports = router