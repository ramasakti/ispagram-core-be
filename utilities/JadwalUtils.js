const db = require('../Config')
const moment = require('./Moment')

const existingJadwal = async (id_jampel, kelas, trx) => {
    const existingJadwal = await trx('jadwal')
        .join('mapel', 'mapel.id_mapel', '=', 'jadwal.mapel')
        .where('jampel', id_jampel)
        .where('kelas_id', kelas)
        .first()
    if (existingJadwal) return existingJadwal
    return null
}

module.exports = { existingJadwal }