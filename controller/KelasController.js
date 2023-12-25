const db = require('../Config')
const response = require('../Response')
const KelasModel = require('../Model/KelasModel')
const SiswaModel = require('../Model/SiswaModel')

const kelas = async (req, res) => {
    try {
        const kelas = await KelasModel.getAllKelasWithWalas()
        return response(200, kelas, 'Berhasil get data kelas!', res)
    } catch (error) {
        console.error(error)
        return response(500, {}, 'Internal Server Error', res)
    }
}

const detail = async (req, res) => {
    try {
        // Tangkap parameter dan periksa apa parameter dikirimkan
        const kelas_id = req.params.kelas_id
        if (!kelas_id) return response(400, null, `Kelas tidak ditemukan!`, res)

        // Ambil detail data dari database
        const detailKelas = await KelasModel.getKelasWithWalasByID(kelas_id)

        return response(200, detailKelas, 'Berhasil get detail kelas!', res)
    } catch (error) {
        console.error(error)
        return response(500, {}, 'Internal Server Error', res)
    }
}

const store = async (req, res) => {
    try {
        // Tangkap inputan dan periksa
        const { tingkat, jurusan, walas } = req.body
        if (!tingkat || !jurusan || !walas) return response(409, null, `Gagal!`, res)
        
        // Masukkan ke database
        await KelasModel.insertKelas({ tingkat, jurusan, walas })

        return response(200, {}, 'Berhasil tambah kelas!', res)
    } catch (error) {
        console.error(error)
        return response(500, {}, 'Internal Server Error', res)
    }
}

const update = async (req, res) => {
    try {
        const id_kelas = req.params.kelas_id
        // Tangkap inputan
        const { tingkat, jurusan, walas } = req.body

        // Query ke database
        await KelasModel.updateKelas(id_kelas, {
            tingkat, jurusan, walas
        })

        return response(201, {}, 'Berhasil update data kelas!', res)
    } catch (error) {
        console.error(error)
        return response(500, {}, 'Internal Server Error', res)
    }
}

const destroy = async (req, res) => {
    try {
        // Tangkap inputan id kelas dari request parameter
        const id_kelas = req.params.kelas_id

        // Ambil informasi kelas
        const detailKelas = await KelasModel.getKelasById(id_kelas)

        // Jika kelas tidak ditemukan
        if (!detailKelas) return response(404, null, `Data kelas yang akan dihapus tidak teridentifikasi`, res)
        
        // Periksa apakah kelas memiliki siswa
        const existingSiswa = await SiswaModel.getSiswaByKelas(id_kelas)
        if (existingSiswa.length > 0) return response(400, null, `Gagal hapus kelas! Terdapat siswa yang terdaftar pada kelas yang akan dihapus`, res)

        // Hapus kelas dari tabel kelas
        await KelasModel.deleteKelas(id_kelas)

        return response(202, {}, 'Berhasil hapus kelas', res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

module.exports = { kelas, detail, store, update, destroy }