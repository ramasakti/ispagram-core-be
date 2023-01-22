const db = require('./../Config')
const response = require('./../Response')
const moment = require('moment')

const tanggalSekarang = moment().format('YYYY-MM-DD');
const waktuSekarang = moment().format('HH:mm:ss');

const dataPresensi = (req, res) => {
    const allDataAbsen = `SELECT * FROM absen JOIN siswa WHERE absen.id_siswa = siswa.id_siswa`
    db.query(allDataAbsen, (err, field) => {
        if (err) throw err
        return response(200, field, 'Data presensi', res)
    })
}

const dataAbsensi = (req, res) => {
    const dataKetidakhadiran = `SELECT * FROM absen JOIN siswa WHERE absen.id_siswa = siswa.id_siswa AND absen.waktu_absen IS NULL`
    db.query(dataKetidakhadiran, (err, field) => {
        if (err) throw err
        return response(200, field, 'Data absensi', res)
    })
}

const engine = (req, res) => {
    const idSiswa = req.body.idSiswa
    const engineSQL = `UPDATE absen SET waktu_absen = '${waktuSekarang}' WHERE id_siswa = '${idSiswa}'` 
    db.query(engineSQL, (err, field) => {
        if (err) throw err
        return response(201, field, 'Berhasil absen', res)
    })
}

const updateAbsen = (req, res) => {
    const { idSiswa, status } = req.body
    const updateAbsenManual = `UPDATE absen SET waktu_absen = NULL, izin = '${tanggalSekarang}', keterangan = '${status}' WHERE id_siswa = '${idSiswa}'`
    db.query(updateAbsenManual, (err, field) => {
        if (err) throw err
        return response(201, field, 'Berhasil update absen', res)
    })
}

const resetRekap = (req, res) => {
    const deleteRekapitulasi = `DELETE FROM rekap_siswa`
    db.query(deleteRekapitulasi, (err, field) => {
        if (err) throw err
        return response(201, field, 'Berhasil reset rekap absen', res)
    })
}

module.exports = { dataPresensi, dataAbsensi, engine, updateAbsen, resetRekap }