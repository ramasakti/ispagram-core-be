const db = require('../Config')
const moment = require('./moment')

const existingJadwal = async (id_jampel, kelas) => {
    const existingJadwal = await db('jadwal').where('jampel', id_jampel).where('kelas_id', kelas).first()
    if (existingJadwal) return existingJadwal
    return null
}

module.exports = { existingJadwal }