const express = require('express')
const app = express()
const cron = require('node-cron')
const path = require('path')
const session = require('express-session')
const passport = require('passport')
const db = require('./Config')
const router = require('./router/Router')
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(router)

app.use(session({
    secret: 'parlaungan1980',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/upload', express.static(path.join(__dirname, 'upload')))
// Node Cron
//  ┌────────────── second (optional)
//  │ ┌──────────── minute
//  │ │ ┌────────── hour
//  │ │ │ ┌──────── day of month
//  │ │ │ │ ┌────── month
//  │ │ │ │ │ ┌──── day of week
//  │ │ │ │ │ │
//  │ │ │ │ │ │
//  * * * * * *

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
                    .select('id_siswa', 'keterangan')
                    .whereNotNull('keterangan')

                // Merekap absen siswa
                for (const updateRekap of dataRekap) {
                    await db('rekap_siswa').insert({
                        tanggal: moment().format('YYYY-MM-DD'),
                        siswa_id: updateRekap.id_siswa,
                        keterangan: updateRekap.keterangan,
                        waktu_absen: null
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

cron.schedule('59 23 * * *', () => {
    RekapAbsen()
})

cron.schedule('0 0 * * *', () => {
    db('absen').update({ waktu_absen: null })
    db('jadwal').update({ status: '' })
})

app.listen(4500, () => {
    console.log(`Server is running`)
})