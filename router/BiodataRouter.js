const express = require('express')
const router = express.Router()
const BiodataController = require('../Controller/BiodataController')

router.route('/biodata/:username')
    .get(BiodataController.biodata)
    .put(BiodataController.updateBiodata)

router.route('/transportasi')
    .get(BiodataController.transport)
    
router.route('/jeting')
    .get(BiodataController.jeting)

router.route('/pendidikan')
    .get(BiodataController.pendidikan)

router.route('/profesi')
    .get(BiodataController.profesi)

module.exports = router