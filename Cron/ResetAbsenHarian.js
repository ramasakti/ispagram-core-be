const DynamicDBConf = require('../DynamicDBConf')
const AbsenSiswaModel = require('../Model/AbsenSiswaModel')

const ResetAbsenHarian = async () => {
    for (const dbID in DynamicDBConf.databases) {
        const db = DynamicDBConf.getDatabaseConnection(dbID)

        // Mulai transaksi
        await db.transaction(async (trx) => {
            // Reset Absen Harian
            await AbsenSiswaModel.updateAbsenToDefault(trx)

            // Reset Jadwal
            await trx('jadwal').update({ status: '' })
        }
    )}

    return true
}

module.exports = ResetAbsenHarian
