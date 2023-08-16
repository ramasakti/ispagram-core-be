const express = require('express')
const router = express.Router()
const SiswaController = require('./../controller/SiswaController')

router.route('/siswa')
    .get(SiswaController.allSiswa)
    .post(SiswaController.storeSiswa)

router.route('/siswa/kelas/:kelas_id')
    .get(SiswaController.siswaKelas)

router.route('/siswa/:id_siswa')
    .get(SiswaController.detailSiswa)
    .put(SiswaController.updateSiswa)
    .delete(SiswaController.deleteSiswa)

module.exports = router