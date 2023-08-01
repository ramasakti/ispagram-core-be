const db = require('./../Config')
const response = require('./../Response')
const hari = require('../utils/Hari')
const moment = require('moment')

const tanggalSekarang = moment().format('YYYY-MM-DD');
const waktuSekarang = moment().format('HH:mm:ss');

const dataPresensi = async (req, res) => {
    const dataPresensi = await db('absen').join('siswa', 'absen.id_siswa', '=', 'siswa.id_siswa').select('*')
    return response(200, dataPresensi, 'Data presensi', res)
}

const dataAbsensi = async (req, res) => {
    const dataKetidakhadiran = await db('absen').join('siswa', 'absen.id_siswa', '=', 'siswa.id_siswa').select('*').whereNull('absen.waktu_absen')
    return response(200, dataKetidakhadiran, 'Data absensi', res)
}

const dataAbsensiKelas = async (req, res) => {
    const kelasId = req.params.kelas_id
    const dataKetidakhadiran = await db('absen').join('siswa', 'absen.id_siswa', '=', 'siswa.id_siswa').where('siswa.kelas_id', kelasId).whereNull('absen.waktu_absen')
    return response(200, dataKetidakhadiran, 'Data absensi', res)
}

const engineAbsenSiswa = async (req, res) => {
    const userabsen = req.params.userabsen
    const engine = await db('absen').where('id_siswa', userabsen).update({
        waktu_absen: waktuSekarang,
        izin: NULL,
        keterangan: ''
    })
    return response(201, engine, 'Berhasil Absen!', res)
}

module.exports = { dataPresensi, dataAbsensi, dataAbsensiKelas, engineAbsenSiswa } 