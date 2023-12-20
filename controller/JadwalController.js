const db = require('../Config')
const response = require('../Response')
const moment = require('../Utilities/Moment')
const jadwalUtils = require('../Utilities/JadwalUtils')
const JadwalModel = require('./../Model/JadwalModel')

const jadwal = async (req, res) => {
    try {
        const jadwalData = await JadwalModel.getFullJadwalByDateNow(moment().format('YYYY-MM-DD'))
        return response(200, jadwalData, 'Jadwal', res);
    } catch (error) {
        console.error(error);
        return response(500, { message: 'Internal Server Error' }, 'Error', res);
    }
}

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
            await JadwalModel.insertJadwal({ jampel: item.value, guru_id: guru, kelas_id: kelas, mapel })
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
        let { jampel, id_guru, kelas_id, mapel } = req.body

        // Periksa apakah inputan lengkap
        if (!jampel || !id_guru || !kelas_id) return response(400, null, `Semua inputan wajib diisi!`, res)

        try {
            // Parsing ke JSON ketika ada perubahan jam pelajaran
            jampel = JSON.parse(jampel)

            // Periksa jadwal apakah berbentrokan
            const existingJadwal = await jadwalUtils.existingJadwal(jampel.value, kelas_id)
            if (existingJadwal !== null) return response(400, null, `Jam Pelajaran telah digunakan!`, res)

            // Update tabel jadwal
            await JadwalModel.updateJadwal(id_jadwal, {
                jampel: jampel.value, guru_id: id_guru, kelas_id: kelas_id, mapel
            })
        } catch (error) {
            jampel = req.body.jampel

            // Update tabel jadwal
            await JadwalModel.updateJadwal(id_jadwal, {
                jampel, guru_id: id_guru, kelas_id: kelas_id, mapel
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

const jadwalGrup = async (req, res) => {
    try {
        // Tangkap inputan dari parameter
        const id_jadwal = req.params.id_jadwal

        // Cek apakah jam berbentrokan
        const existingJadwal = await db('jadwal').join('jam_pelajaran', 'jam_pelajaran.id_jampel', '=', 'jadwal.jampel').where('id_jadwal', id_jadwal).first()
        if (!existingJadwal) return response(400, null, `Jadwal tidak ditemukan!`, res)

        const jadwal = await db('jadwal')
            .join('jam_pelajaran', 'jam_pelajaran.id_jampel', '=', 'jadwal.jampel')
            .where('mapel', existingJadwal.mapel)
            .where('kelas_id', existingJadwal.kelas_id)
            .where('guru_id', existingJadwal.guru_id)
            .where('jam_pelajaran.hari', existingJadwal.hari)

        return response(200, jadwal, `Jadwal Grup`, res)
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal server error!`, res)
    }
}

module.exports = { jadwal, storeJadwal, updateJadwal, deleteJadwal, jadwalGrup }