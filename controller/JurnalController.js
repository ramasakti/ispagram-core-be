const db = require('../Config')
const response = require('../Response')
const moment = require('../utilities/Moment')
const JurnalModel = require('../Model/JurnalModel')
const JadwalModel = require('../Model/JadwalModel')

const store = async (req, res) => {
    try {
        const { id_jadwal, inval, guru, materi } = req.body
        if (!id_jadwal || !materi) return response(400, req.body, `Semua data wajib diisi!`, res)

        
        const jadwal = await JadwalModel.getJadwalWithJampelByIDJadwal(id_jadwal, req.db)
        if (!jadwal) return response(404, null, `Jadwal tidak ditemukan!`, res)

        if (jadwal.hari !== moment().format('dddd')) return response(400, null, `Gagal! Jadwal tidak terjadwal hari ini!`, res)

        const jurnal = await JurnalModel.getJurnalByDateAndJadwalID(moment().format('YYYY-MM-DD'), id_jadwal)
        if (jurnal) await JurnalModel.deleteJurnalByDateAndJadwalID(moment().format('YYYY-MM-DD'), id_jadwal)

        await JurnalModel.insertJurnal({
            tanggal: moment().format('YYYY-MM-DD'),
            waktu: moment().format('HH:mm:ss'),
            jadwal_id: id_jadwal,
            inval,
            guru_id: guru ?? jadwal.guru_id,
            materi
        }, req.db)

        return response(201, {}, `Berhasil insert jurnal!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const jurnal = async (req, res) => {
    try {
        const { tanggal, kelas } = req.query
        if (!tanggal || !kelas) return response(400, null, `Form Tidak Lengkap!`, res)

        let jurnal = await JurnalModel.getJurnalByDateAndKelas(tanggal, kelas, req.db)
        if (jurnal.length < 1) return response(200, null, `Jurnal Kosong!`, res)

        jurnal = jurnal.map(item => ({
            ...item,
            tanggal: moment().format('YYYY-MM-DD')
        }))
        
        return response(200, jurnal, `Data Jurnal Tanggal ${tanggal} kelas ${jurnal.tingkat}`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const update = async (req, res) => {
    try {
        const id_jurnal = req.params.id_jurnal
        const { inval, guru_id, materi } = req.body

        await JurnalModel.updateJurnalByID(id_jurnal, {
            inval, guru_id, materi
        }, req.db)

        return response(201, {}, `Berhasil update jurnal`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

module.exports = {
    store,
    jurnal,
    update
};
