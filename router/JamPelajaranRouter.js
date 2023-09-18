const express = require('express')
const router = express.Router()
const JamPelajaranController = require('./../controller/JamPelajaranController')

router.route('/jampel')
    .get(JamPelajaranController.jamPelajaran)
    .post(JamPelajaranController.storeJampel)

router.route('/jampel/generate')
    .get(JamPelajaranController.generateJampel)
    .post(JamPelajaranController.importJampel)

router.route('/jampel/hari/:hari')
    .get(JamPelajaranController.detailJampel)    

router.route('/jampel/:id_jampel')
    .put(JamPelajaranController.updateJampel)
    .delete(JamPelajaranController.deleteJampel)

module.exports = router