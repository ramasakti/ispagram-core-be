const db = require('./../Config')
const response = require('./../Response')
const moment = require('../utilities/moment')

const allSiswa = async (req, res) => {
    const dataSiswa = await db('siswa').select()
    return response(200, dataSiswa, 'Get Data Siswa', res)
}

const siswaKelas = async (req, res) => {
    const kelas_id = req.params.kelas_id
    const siswaKelas = await db('siswa').where('kelas_id', kelas_id).select()
    return response(200, siswaKelas, `Data Siswa Kelas`, res)
}

const detailSiswa = async (req, res) => {
    const idSiswa = req.params.id_siswa
    const detailSiswa = await db('siswa').where('id_siswa', idSiswa).first()
    if (!detailSiswa) {
        return response(400, null, `ID siswa tidak terdaftar! Data siswa tidak ditemukan!`, res)
    }
    return response(200, detailSiswa, 'Get Detail Siswa', res)
}

const storeSiswa = async (req, res) => {
    try {
        const { id_siswa, rfid, nama_siswa, kelas_id, alamat, telp, tempat_lahir, tanggal_lahir } = req.body
        if (!id_siswa || !rfid || !nama_siswa || !kelas_id || !alamat || !tempat_lahir || !tanggal_lahir) {
            return response(400, null, 'Semua data siswa harus diisi!', res)
        }
        const existingSiswa = await db('siswa').where('id_siswa', id_siswa).first()
        if (existingSiswa) {
            return response(409, null, 'ID siswa sudah ada dalam database!', res)
        }
        if (!moment(tanggal_lahir, 'YYYY-MM-DD', true).isValid()) {
            return response(400, null, 'Tanggal lahir tidak valid! Format harus YYYY-MM-DD', res)
        }
        const storeSiswa = await db('siswa').insert({
            id_siswa, nama_siswa, kelas_id, alamat, telp, tempat_lahir, tanggal_lahir
        })
        return response(201, storeSiswa, 'Berhasil menambahkan data siswa!', res)
    } catch (error) {
        console.error('Error storing data:', error)
        return response(500, null, 'Terjadi kesalahan saat menyimpan data siswa!', res)
    }
}

const updateSiswa = async (req, res) => {
    const idSiswa = req.params.id_siswa
    const { rfid, nama_siswa, kelas_id, alamat, telp, tempat_lahir, tanggal_lahir } = req.body
    const tanggalLahirFormatted = moment(tanggal_lahir).format("YYYY-MM-DD")
    if (!idSiswa || !rfid || !nama_siswa || !kelas_id || !alamat || !tempat_lahir || !tanggal_lahir) {
        return response(400, null, 'Semua data siswa harus diisi!', res)
    }
    if (!moment(tanggalLahirFormatted, 'YYYY-MM-DD', true).isValid()) {
        return response(400, null, 'Tanggal lahir tidak valid! Format harus YYYY-MM-DD', res)
    }
    const updateSiswa = await db('siswa')
        .where('id_siswa', idSiswa)
        .update({
            rfid, nama_siswa, kelas_id, alamat, telp, tempat_lahir, tanggal_lahir: tanggalLahirFormatted
        })
    return response(201, updateSiswa, 'Berhasil update data siswa!', res)
}

const deleteSiswa = async (req, res) => {
    const idSiswa = req.params.id_siswa
    const detailSiswa = await db('siswa').where('id_siswa', idSiswa).first()
    if (!detailSiswa) {
        return response(400, null, `ID siswa tidak terdaftar! Data siswa tidak ditemukan!`, res)
    }
    const deleteSiswa = await db('siswa').where('id_siswa', idSiswa).del()
    return response(201, deleteSiswa, 'Berhasil delete siswa!', res)
}

module.exports = { allSiswa, siswaKelas, detailSiswa, storeSiswa, updateSiswa, deleteSiswa }