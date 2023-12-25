const express = require('express')
const router = express.Router()
const GuruController = require('../controller/GuruController')

router.route('/guru')
    .get(GuruController.guru)
    .post(GuruController.store)

router.route('/staf')
    .get(GuruController.staf)

router.route('/guru/:id_guru')
    .put(GuruController.update)
    .delete(GuruController.destroy)

module.exports = router