const express = require('express')
const router = express.Router()
const WhatsAppController = require('../controller/WhatsAppController')

router.route('/whatsapp/personal')
    .post(WhatsAppController.sendToPersonal)

module.exports = router