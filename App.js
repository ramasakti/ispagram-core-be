const express = require('express')
const app = express()
const cron = require('node-cron')
const path = require('path')
const session = require('express-session')
const passport = require('passport')
const db = require('./Config')
const router = require('./router/Router')
const cors = require('cors')
const moment = require('./utilities/moment')

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

const hariLibur = async () => {
    const tahun = moment().format('YYYY')
    const response = await fetch(`https://api-harilibur.vercel.app/api?year=${tahun}`)
    const data = await response.json()

    const libur = data.filter(libur => libur.is_national_holiday === true)

    libur.map(async item => {
        await db('libur').insert({
            keterangan: item.holiday_name,
            mulai: item.holiday_date,
            sampai: item.holiday_date
        })
    })
}

cron.schedule('0 0 1 1 *', hariLibur, {
    scheduled: true,
    timezone: 'Asia/Jakarta'
})

cron.schedule('59 23 * * *', async () => {
    await RekapAbsen()
})

cron.schedule('0 0 * * *', async () => {
    await db('absen').update({ waktu_absen: null })
    await db('jadwal').update({ status: '' })
})

app.listen(4500, () => {
    console.log(`Server is running`)
})