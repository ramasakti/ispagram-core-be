const express = require('express')
const router = express.Router()
const JurnalController = require('../controller/JurnalController')

router.route('/jurnal')
    .get(JurnalController.jurnal)
    .post(JurnalController.store)

router.route('/jurnal/:id_jurnal')
    .put(JurnalController.update)

module.exports = router