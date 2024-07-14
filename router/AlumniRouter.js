const express = require('express')
const router = express.Router()
const AlumniController = require('../controller/AlumniController')

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.route('/alumni')
    .get(AlumniController.alumni)

router.route('/alumni/tunggakan')
    .get(AlumniController.tunggakan)

router.route('/alumni/tahun/:tahun')
    .get(AlumniController.alumniTahun)

router.route('/alumni/import')
    .post(upload.single('file'), AlumniController.importAlumni)

module.exports = router