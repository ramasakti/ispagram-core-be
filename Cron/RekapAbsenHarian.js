const db = require('./Config')
const cron = require('node-cron')
const moment = require('./Utilities/Moment')

const RekapAbsen = async () => {
    try {
        // Cek Pengondisian Hari Libur/Minggu
        const cekHari = await db('hari')
            .where('nama_hari', moment().format('dddd'))
            .first()

        // Cek data hari libur
        const cekLibur = await db('libur')
            .where('mulai', '<=', moment().format('YYYY-MM-DD'))
            .andWhere('sampai', '>=', moment().format('YYYY-MM-DD'))
            .select()

        // Cek apakah hari aktif
        if (cekHari.status === 1) {
            // Cek apakah bukan hari libur
            if (cekLibur.length === 0) {
                // Update ke alfa jika belum diset status hadirnya
                await db('absen')
                    .whereNull('waktu_absen')
                    .andWhere('keterangan', '')
                    .update({
                        keterangan: 'A'
                    })

                // Ambil data keterangan absen siswa untuk direkap
                const dataRekap = await db('absen')
                    .select('id_siswa', 'keterangan', 'waktu_absen')
                    .whereNot('keterangan', 'H')

                // Merekap absen siswa
                for (const updateRekap of dataRekap) {
                    await db('rekap_siswa').insert({
                        tanggal: moment().format('YYYY-MM-DD'),
                        siswa_id: updateRekap.id_siswa,
                        keterangan: updateRekap.keterangan,
                        waktu_absen: (updateRekap.keterangan === 'T') ? updateRekap.waktu_absen : null
                    })
                }
            } else {
                // Jika libur

                // Ambil data jadwal yang tidak diatur untuk direkap ketidakhadirannya
                const dataJadwal = await db('jadwal')
                    .select('id_jadwal', 'mulai', 'sampai')
                    .where('hari', moment().format('dddd'))

                // Masukkan data jadwal di hari tersebut ke jurnal
                for (const insertJadwal of dataJadwal) {
                    await db('jurnal').insert({
                        tanggal: moment().format('YYYY-MM-DD'),
                        jadwal_id: insertJadwal.id_jadwal,
                        inval: 0,
                        transport: 0,
                        materi: 'Libur'
                    })
                }
            }
        }
    } catch (error) {
        console.error('Error executing cron job:', error)
    }
}

cron.schedule('59 23 * * *', async () => {
    await RekapAbsen()
})

module.exports = {
    cron
};
