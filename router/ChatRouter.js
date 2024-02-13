const express = require('express')
const router = express.Router()
const ChatController = require('../controller/ChatController')

router.route('/chat/:username')
    .get(ChatController.chat)

router.route('/chat/detail/:sender/:receiver')
    .get(ChatController.detailBySenderAndReceiver)

router.route('/chat/detail/:id_chat')
    .get(ChatController.detailByID)

router.route('/chat/store')
    .post(ChatController.store)

module.exports = router