const moment = require('../utilities/Moment')
const HariModel = require('../Model/HariModel')
const LiburModel = require('../Model/LiburModel')
const AbsenSiswaModel = require('../Model/AbsenSiswaModel')
const DynamicDBConf = require('../DynamicDBConf')

const RekapAbsen = async () => {
    try {
        // Iterasi melalui semua database
        for (const dbID in DynamicDBConf.databases) {
            const db = DynamicDBConf.getDatabaseConnection(dbID)

            // Mulai transaksi
            await db.transaction(async (trx) => {
                try {
                    // Cek Pengondisian Hari Libur/Minggu
                    const cekHari = await HariModel.getHariByHari(moment().format('dddd'), trx)

                    // Cek data hari libur
                    const cekLibur = await LiburModel.getLiburByDateRange(moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'), trx)

                    // Cek apakah hari aktif
                    if (cekHari.status === 1) {
                        // Cek apakah bukan hari libur
                        if (cekLibur.length < 1) {                            
                            // Update ke alfa jika belum diset status hadirnya
                            await AbsenSiswaModel.autoAlfa(trx)

                            // Ambil data keterangan absen siswa untuk direkap
                            const dataRekap = await AbsenSiswaModel.getAllNotPresent(trx)                            

                            // Merekap absen siswa
                            for (const updateRekap of dataRekap) {
                                await AbsenSiswaModel.insertRekap({
                                    tanggal: moment().format('YYYY-MM-DD'),
                                    siswa_id: updateRekap.id_siswa,
                                    keterangan: updateRekap.keterangan ?? 'A',
                                    waktu_absen: (updateRekap.keterangan === 'T') ? updateRekap.waktu_absen : null
                                }, trx)
                            }
                        } else {
                            // Jika libur, masukkan jadwal ke jurnal mengajar
                        }
                    }

                    // Commit transaksi
                    await trx.commit()
                } catch (error) {
                    // Rollback jika ada error
                    await trx.rollback()
                    console.error(`Error executing cron job for database ${dbID}:`, error)
                }
            })
        }
    } catch (error) {
        console.error('Error executing cron job:', error)
    }
}

module.exports = RekapAbsen
