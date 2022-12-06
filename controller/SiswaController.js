const response = require('./../Response')

const allSiswa = (req, res) => {
    return response(200, 'Siswa', 'Get Data Siswa', res)
}

const detailSiswa = (req, res) => {
    return response(200, 'Siswa', 'Get Detail Siswa', res)
}

module.exports = { allSiswa, detailSiswa }