const express = require('express')
const router = express.Router()
const LiburController = require('../controller/LiburController')

router.route('/libur')
    .get(LiburController.libur)
    .post(LiburController.storeLibur)

router.route('/libur/:id_libur')
    .put(LiburController.updateLibur)
    .delete(LiburController.deleteLibur)

module.exports = router