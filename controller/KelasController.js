const db = require('./../Config')
const response = require('./../Response')

const kelas = async (req, res) => {
    const kelas = await db('kelas').select()
    return response(200, kelas, 'Berhasil get data kelas!', res)
}

const detailKelas = async (req, res) => {
    const kelasId = req.params.kelas_id
    const detailKelas = await db('kelas').select().where('id_kelas', kelasId)
    return response(200, detailKelas, 'Berhasil get detail kelas!', res)
}

module.exports = { kelas, detailKelas }