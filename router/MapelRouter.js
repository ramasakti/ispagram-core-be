const express = require('express')
const router = express.Router()
const MapelController = require('../controller/MapelController')

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.route('/mapel')
    .get(MapelController.mapel)
    .post(MapelController.store)

router.route('/mapel/import/excel')
    .post(upload.single('file'), MapelController.importMapel)

router.route('/mapel/:id_mapel')
    .put(MapelController.update)
    .delete(MapelController.destroy)

router.route('/mapel/kelas/:kelas_id')
    .get(MapelController.mapelByKelas)

module.exports = router