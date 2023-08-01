const db = require('./../Config')
const response = require('./../Response')

const allSiswa = async (req, res) => {
    const dataSiswa = await db('siswa').select()
    return response(200, dataSiswa, 'Get Data Siswa', res)
}

const detailSiswa = async (req, res) => {
    const idSiswa = req.params.id_siswa
    const detailSiswa = await db('siswa').where('id_siswa', idSiswa)
    return response(200, detailSiswa, 'Get Detail Siswa', res)
}

const storeSiswa = async (req, res) => {
    const { id_siswa, nama_siswa, kelas_id, alamat, telp, tempat_lahir, tanggal_lahir } = req.body
    const storeSiswa = await db('siswa')
                                .insert({
                                    id_siswa, nama_siswa, kelas_id, alamat, telp, tempat_lahir, tanggal_lahir
                                })
    return response(201, storeSiswa, 'Berhasil menambahkan data siswa!', res)
}

const updateSiswa = async (req, res) => {
    const idSiswa = req.params.id_siswa
    const { idBaru, nama_siswa, kelas_id, alamat, telp, tempat_lahir, tanggal_lahir } = req.body
    const updateSiswa = await db('siswa')
                                .where('id_siswa', idSiswa)
                                .update({
                                    idBaru, nama_siswa, kelas_id, alamat, telp, tempat_lahir, tanggal_lahir
                                })
    return response(201, updateSiswa, 'Berhasil update data siswa!', res)
}

const deleteSiswa = async (req, res) => {
    const idSiswa = req.params.id_siswa
    const deleteSiswa = await db('siswa').where('id_siswa', idSiswa).del()
    return response(200, deleteSiswa, 'Berhasil delete siswa!', res)
}



module.exports = { allSiswa, detailSiswa, storeSiswa, updateSiswa, deleteSiswa }