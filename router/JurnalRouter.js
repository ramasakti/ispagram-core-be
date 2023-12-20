const express = require('express')
const router = express.Router()
const JurnalController = require('../Controller/JurnalController')

router.route('/jurnal')
    .get(JurnalController.jurnal)
    .post(JurnalController.insertingJurnal)

module.exports = router