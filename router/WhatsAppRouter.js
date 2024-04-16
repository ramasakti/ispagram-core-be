const express = require('express')
const router = express.Router()
const WhatsAppController = require('../controller/WhatsAppController')

router.route('/whatsapp/primary')
    .get(WhatsAppController.primary)

router.route('/whatsapp/connect')
    .post(WhatsAppController.connect)

router.route('/whatsapp/groups')
    .post(WhatsAppController.groups)

router.route('/whatsapp/personal')
    .post(WhatsAppController.sendToPersonal)

module.exports = router