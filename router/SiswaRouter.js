const express = require('express')
const router = express.Router()
const response = require('./../Response')
const SiswaController = require('./../controller/SiswaController')

router.route('/siswa')
    .get(SiswaController.allSiswa)
    .post((req, res) => {

    })

router.route('/siswa/:id_siswa')
    .put((req, res) => {
        response.send()
    })
    .delete((req, res) => {
        response.send()
    })

module.exports = router