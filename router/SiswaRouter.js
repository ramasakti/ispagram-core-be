const express = require('express')
const router = express.Router()
const SiswaController = require('../controller/SiswaController')
const middleware = require('../utilities/Middleware')

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.route('/siswa')
    .get(SiswaController.siswa)
    .post(SiswaController.store)

router.route('/siswa/kelas/:kelas_id')
    .get(SiswaController.siswaKelas)

router.route('/siswa/:id_siswa')
    .get(SiswaController.detail)
    .put(SiswaController.update)
    .delete(SiswaController.destroy)

router.route('/siswa/import/excel')
    .post(upload.single('file'), SiswaController.importSiswa)

router.route('/siswa/template/excel')
    .get(SiswaController.exportExcel)

module.exports = router