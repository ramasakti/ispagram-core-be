const db = require('../Config')
const moment = require('../utilities/Moment')

const ResetAbsenHarian = async () => {
    await db('absen')
        .whereNull('izin')
        .update({ waktu_absen: null, keterangan: '' })

    await db('jadwal').update({ status: '' })

    return true
}

module.exports = ResetAbsenHarian
