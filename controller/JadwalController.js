const db = require('./../Config')
const response = require('./../Response')
const moment = require('../utilities/moment')
const jadwalUtils = require('../utilities/JadwalUtils')

const jadwal = async (req, res) => {
    try {
        const jadwalData = await db('jadwal')
            .select('jadwal.id_jadwal', 'jam_pelajaran.hari', 'jam_pelajaran.id_jampel as jampel', 'jam_pelajaran.mulai', 'jam_pelajaran.selesai', 'guru.id_guru as guru', 'guru.nama_guru', 'kelas.id_kelas as kelas', 'kelas.tingkat', 'kelas.jurusan', 'jadwal.mapel')
            .join('jam_pelajaran', 'jadwal.jampel', '=', 'jam_pelajaran.id_jampel')
            .join('kelas', 'jadwal.kelas_id', '=', 'kelas.id_kelas')
            .join('guru', 'jadwal.guru_id', '=', 'guru.id_guru')

        return response(200, jadwalData, 'Jadwal', res);
    } catch (error) {
        console.error(error);
        return response(500, { message: 'Terjadi kesalahan server' }, 'Error', res);
    }
};

const storeJadwal = async (req, res) => {
    try {
        // Tangkap inputan dan periksa
        const { jampel, guru, kelas, mapel } = req.body
        if (!jampel || !guru || !kelas || !mapel) return response(400, null, `Gagal! Inputan tidak lengkap!`, res)

        // Parse jampel menjadi JSON
        const jam_pelajaran = JSON.parse(jampel)

        // Variabel penampung error
        let hasError = false

        // Looping jampel 
        for (const item of jam_pelajaran) {
            // Cek apakah jam sudah digunakan 
            const existingJadwal = await jadwalUtils.existingJadwal(item.value, kelas)
            if (existingJadwal !== null) {
                hasError = true
                break
            }
        }

        // Jika jampel bentrok
        if (hasError) return response(400, null, `Jam Pelajaran telah digunakan!`, res);

        // Jika tidak ada kesalahan, store ke database
        for (const item of jam_pelajaran) {
            await db('jadwal').insert({ jampel: item.value, guru_id: guru, kelas_id: kelas, mapel })
        }

        return response(201, {}, `Berhasil menambahkan data jadwal!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const updateJadwal = async (req, res) => {
    try {
        // Tangkap request parameter
        const id_jadwal = req.params.id_jadwal
        
        // Tangkap inputan dan periksa
        let { jampel, guru, kelas, mapel } = req.body

        // Periksa apakah inputan lengkap
        if (!jampel || !guru || !kelas) return response(400, null, `Semua inputan wajib diisi!`, res)
        
        try {
            // Parsing ke JSON ketika ada perubahan jam pelajaran
            jampel = JSON.parse(jampel)
            
            // Periksa jadwal apakah berbentrokan
            const existingJadwal = await jadwalUtils.existingJadwal(jampel.value, kelas)
            if (existingJadwal !== null) return response(400, null, `Jam Pelajaran telah digunakan!`, res)
            
            // Update tabel jadwal
            await db('jadwal').where('id_jadwal', id_jadwal).update({
                jampel: jampel.value, guru_id: guru, kelas_id: kelas, mapel
            })
        } catch (error) {
            jampel = req.body.jampel
            
            // Update tabel jadwal
            await db('jadwal').where('id_jadwal', id_jadwal).update({
                jampel, guru_id: guru, kelas_id: kelas, mapel
            })
        }

        return response(201, {}, `Berhasil update jadwal!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const deleteJadwal = async (req, res) => {
    try {
        // Tangkap inputan dari parameter
        const id_jadwal = req.params.id_jadwal

        // Cek apakah jam berbentrokan
        const existingJadwal = await db('jadwal').where('id_jadwal', id_jadwal).first()
        if (!existingJadwal) return response(400, null, `Jadwal tidak ditemukan!`, res)

        // Insert ke tabel
        await db('jadwal').where('id_jadwal', id_jadwal).del()

        return response(201, {}, `Berhasil delete jadwal`, res)
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal server error!`, res)
    }
}

module.exports = { jadwal, storeJadwal, updateJadwal, deleteJadwal }