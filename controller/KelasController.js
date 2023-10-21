const db = require('./../Config')
const response = require('./../Response')

const kelas = async (req, res) => {
    try {
        const kelas = await db('kelas').join('guru', 'kelas.walas', '=', 'guru.id_guru').select('id_kelas', 'tingkat', 'jurusan', 'id_guru as walas', 'nama_guru as nama_walas')
        return response(200, kelas, 'Berhasil get data kelas!', res)
    } catch (error) {
        console.error(error)
        return response(500, {}, 'Internal Server Error', res)
    }
}

const detailKelas = async (req, res) => {
    try {
        // Tangkap parameter dan periksa apa parameter dikirimkan
        const kelasId = req.params.kelas_id
        if (!kelasId) return response(400, null, `Kelas tidak ditemukan!`, res)

        // Ambil detail data dari database
        const detailKelas = await db('kelas').select().where('id_kelas', kelasId)

        return response(200, detailKelas, 'Berhasil get detail kelas!', res)
    } catch (error) {
        console.error(error)
        return response(500, {}, 'Internal Server Error', res)
    }
}

const storeKelas = async (req, res) => {
    try {
        // Tangkap inputan dan periksa
        const { tingkat, jurusan, walas } = req.body
        if (!tingkat || !jurusan || !walas) return response(409, null, `Gagal!`, res)
        
        // Masukkan ke database
        const storeKelas = await db('kelas').insert({ tingkat, jurusan, walas })

        return response(200, storeKelas, 'Berhasil get detail kelas!', res)
    } catch (error) {
        console.error(error)
        return response(500, {}, 'Internal Server Error', res)
    }
}

const updateKelas = async (req, res) => {
    try {
        // Tangkap inputan
        const { id_kelas, tingkat, jurusan, walas } = req.body

        // Query ke database
        const updateKelas = await db('kelas').where('id_kelas', id_kelas).update({
            tingkat, jurusan, walas
        })

        return response(201, updateKelas, 'Berhasil update data kelas!', res)
    } catch (error) {
        console.error(error)
        return response(500, {}, 'Internal Server Error', res)
    }
}

const deleteKelas = async (req, res) => {
    try {
        // Tangkap inputan id kelas dari request parameter
        const id_kelas = req.params.kelas_id

        // Ambil informasi kelas
        const detailKelas = await db('kelas').where('id_kelas', id_kelas).first()

        // Jika kelas tidak ditemukan
        if (!detailKelas) return response(404, null, `Data kelas yang akan dihapus tidak teridentifikasi`, res)
        
        // Periksa apakah kelas memiliki siswa
        const existingSiswa = await db('siswa').select().where('kelas_id', id_kelas)
        if (existingSiswa) return response(400, null, `Gagal hapus kelas! Terdapat siswa yang terdaftar pada kelas yang akan dihapus`, res)

        // Hapus kelas dari tabel kelas
        const deleteKelas = await db('kelas').where('id_kelas', id_kelas).del()

        return response(202, deleteKelas, 'Berhasil hapus kelas', res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

module.exports = { kelas, detailKelas, storeKelas, updateKelas, deleteKelas }