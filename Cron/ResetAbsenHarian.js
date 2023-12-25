const db = require('./Config')
const cron = require('node-cron')
const moment = require('./Utilities/Moment')

cron.schedule('0 0 * * *', async () => {
    await db('absen')
        .whereNull('izin')
        .update({ waktu_absen: null, keterangan: '' })
    await db('jadwal').update({ status: '' })
})