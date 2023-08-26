const express = require('express')
const router = express.Router()
const SiswaController = require('./../controller/SiswaController')

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.route('/siswa')
    .get(SiswaController.allSiswa)
    .post(SiswaController.storeSiswa)

router.route('/siswa/kelas/:kelas_id')
    .get(SiswaController.siswaKelas)

router.route('/siswa/:id_siswa')
    .get(SiswaController.detailSiswa)
    .put(SiswaController.updateSiswa)
    .delete(SiswaController.deleteSiswa)

router.route('/siswa/import/excel')
    .post(upload.single('file'), SiswaController.importSiswa)

module.exports = router