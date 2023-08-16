const db = require('./../Config')
const response = require('./../Response')

const kelas = async (req, res) => {
    const kelas = await db('kelas').join('guru', 'kelas.walas', '=', 'guru.id_guru').select('id_kelas', 'tingkat', 'jurusan', 'id_guru as walas', 'nama_guru as nama_walas')
    return response(200, kelas, 'Berhasil get data kelas!', res)
}

const detailKelas = async (req, res) => {
    const kelasId = req.params.kelas_id
    const detailKelas = await db('kelas').select().where('id_kelas', kelasId)
    return response(200, detailKelas, 'Berhasil get detail kelas!', res)
}

const storeKelas = async (req, res) => {
    const { tingkat, jurusan, walas } = req.body
    if (!tingkat || !jurusan || !walas) {
        return response(409, null, `Gagal!`, res)
    }
    const storeKelas = await db('kelas').insert({ tingkat, jurusan, walas })
    return response(200, storeKelas, 'Berhasil get detail kelas!', res)
}

const updateKelas = async (req, res) => {
    const { id_kelas, tingkat, jurusan, walas } = req.body
    const updateKelas = await db('kelas').where('id_kelas', id_kelas).update({
        tingkat, jurusan, walas
    })
    response(201, updateKelas, 'Berhasil update data kelas!', res)
}

const deleteKelas = async (req, res) => {
    const id_kelas = req.params.kelas_id
    const detailKelas = await db('kelas').where('id_kelas', id_kelas).first()
    if (!detailKelas) {
        return response(404, null, `Data kelas yang akan dihapus tidak teridentifikasi`, res)
    }
    const deleteKelas = await db('kelas').where('id_kelas', id_kelas).del()
    response(202, deleteKelas, 'Berhasil hapus kelas', res)
}

module.exports = { kelas, detailKelas, storeKelas, updateKelas, deleteKelas }