const express = require('express')
const router = express.Router()
const KedisiplinanController = require('../controller/KedisiplinanController')

router.route('/kedisiplinan')
    .get(KedisiplinanController.kedisiplinan)
    .post(KedisiplinanController.store)

router.route('/kedisiplinan/:id_kedisiplinan')
    .put(KedisiplinanController.update)
    .delete(KedisiplinanController.destroy)

module.exports = router