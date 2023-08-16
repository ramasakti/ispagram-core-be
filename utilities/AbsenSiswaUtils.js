const db = require('../Config')
const response = require('./../Response')
const moment = require('./moment')

const dataAbsensiSiswaIndividu = async (id_siswa) => {
    const dataAbsensiSiswaIndividu = await db('absen').join('siswa', 'absen.id_siswa', '=', 'siswa.id_siswa').select('siswa.nama_siswa', 'absen.waktu_absen').where('siswa.id_siswa', id_siswa).first()
    return dataAbsensiSiswaIndividu
}

const absenTerlambat = async (id_siswa) => {
    const absenTerlambat = await db('rekap_siswa').insert({
        tanggal: moment().format('YYYY-MM-DD'),
        siswa_id: id_siswa,
        keterangan: 'T',
        waktu_absen: moment().format('HH:mm:ss')
    })
    return absenTerlambat
}

const rekapAbsen = async (id_siswa, keterangan) => {
    let waktu_absen = ''
    if (keterangan === 'H') {
        waktu_absen = jamMasuk().masuk
    }else if (keterangan === 'T') {
        waktu_absen = moment.format('HH:mm:ss')
    }else{
        waktu_absen = null
    }
    const rekapAbsen = await db('rekap_siswa').insert({
        tanggal: moment().format('YYYY-MM-DD'),
        siswa_id: id_siswa,
        keterangan,
        waktu_absen
    })
    return rekapAbsen
}

const jamMasuk = async () => {
    const jamMasuk = await db('hari').select().where('nama_hari', moment().format('dddd')).first()
    return jamMasuk
}

module.exports = { dataAbsensiSiswaIndividu, jamMasuk, absenTerlambat, rekapAbsen }