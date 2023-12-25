const express = require('express')
const router = express.Router()
const SectionController = require('../controller/SectionController')

router.route('/section')
    .get(SectionController.section)
    .post(SectionController.store)

router.route('/section/:id_section')
    .put(SectionController.update)
    .delete(SectionController.destroy)

router.route('/icons')
    .get(SectionController.icons)

module.exports = router