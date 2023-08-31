const express = require('express')
const router = express.Router()
const GuruController = require('./../controller/GuruController')

router.route('/guru')
    .get(GuruController.guru)
    .post(GuruController.storeGuru)

router.route('/guru/:id_guru')
    .put(GuruController.updateGuru)
    .delete(GuruController.deleteGuru)

module.exports = router