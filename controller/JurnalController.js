const db = require('./../Config')
const response = require('./../Response')
const moment = require('../utilities/moment')

const insertingJurnal = async (req, res) => {
    try {
        const { id_jadwal, inval, guru, materi } = req.body
        if (!id_jadwal || !guru || !materi) return response(400, req.body, `Semua data wajib diisi!`, res)

        const jadwal = await db('jadwal').join('jam_pelajaran', 'jam_pelajaran.id_jampel', '=', 'jadwal.jampel').where('id_jadwal', id_jadwal).first()
        if (!jadwal) return response(404, null, `Jadwal tidak ditemukan!`, res)

        if (jadwal.hari !== moment().format('dddd')) return response(400, null, `Gagal! Jadwal tidak terjadwal hari ini!`, res)

        const jurnal = await db('jurnal').where('tanggal', moment().format('YYYY-MM-DD')).where('jadwal_id', id_jadwal).first()
        if (jurnal) await db('jurnal').where('tanggal', moment().format('YYYY-MM-DD')).where('jadwal_id', id_jadwal).del()

        await db('jurnal').insert({
            tanggal: moment().format('YYYY-MM-DD'),
            jadwal_id: id_jadwal,
            inval,
            guru_id: guru,
            materi
        })

        return response(201, {}, `Berhasil insert jurnal!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

module.exports = {
    insertingJurnal
};
