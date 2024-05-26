const express = require('express')
const router = express.Router()
const MapelController = require('../controller/MapelController')

router.route('/mapel')
    .get(MapelController.mapel)
    .post(MapelController.store)

router.route('/mapel/:id_mapel')
    .put(MapelController.update)
    .delete(MapelController.destroy)

router.route('/mapel/kelas/:kelas_id')
    .get(MapelController.mapelByKelas)

module.exports = router