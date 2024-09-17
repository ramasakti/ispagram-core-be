const express = require('express')
const router = express.Router()
const GedungController = require('../controller/GedungController')

router.route('/gedung')
    .get(GedungController.gedung)
    .post(GedungController.store)

router.route('/gedung/:id_gedung')
    .put(GedungController.update)
    .delete(GedungController.destroy)

module.exports = router