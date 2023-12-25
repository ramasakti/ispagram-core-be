const express = require('express')
const router = express.Router()
const JurnalController = require('../controller/JurnalController')

router.route('/jurnal')
    .get(JurnalController.jurnal)
    .post(JurnalController.insertingJurnal)

module.exports = router