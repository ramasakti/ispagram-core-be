const express = require('express')
const router = express.Router()
const JamPelajaranController = require('./../controller/JamPelajaranController')

router.route('/jampel')
    .get(JamPelajaranController.jamPelajaran)
    .post(JamPelajaranController.storeJampel)

router.route('/jampel/:id_jampel')
    .put(JamPelajaranController.updateJampel)
    .delete(JamPelajaranController.deleteJampel)

module.exports = router