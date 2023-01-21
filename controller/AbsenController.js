const db = require('./../Config')
const response = require('./../Response')

const dataPresensi = (req, res) => {
    const sql = `SELECT * FROM absen JOIN siswa WHERE absen.id_siswa = siswa.id_siswa`
    db.query(sql, (err, field) => {
        if (err) throw err
        return response(200, field, 'Data presensi', res)
    })
}

const dataAbsensi = (req, res) => {
    const nullable = null
    const sql = `SELECT * FROM absen JOIN siswa WHERE absen.id_siswa = siswa.id_siswa AND absen.waktu_absen IS NULL`
    db.query(sql, (err, field) => {
        if (err) throw err
        return response(200, field, 'Data absensi', res)
    })
}

const engine = (req, res) => {
    const idSiswa = req.body
    const sql = `UPDATE absen SET waktu_absen = '' WHERE id_siswa = '${idSiswa}'`
    db.query(sql, (err, field) => {
        if (err) throw err
        return response(201, field, 'Berhasil absen', res)
    })
}

const updateAbsen = (req, res) => {
    const { idSiswa, status } = req.body
    const sql = `UPDATE absen SET waktu_absen = '', izin = '', keterangan = '${status}' WHERE id_siswa = '${idSiswa}'`
    db.query(sql, (err, field) => {
        if (err) throw err
        return response(201, field, 'Berhasil update absen', res)
    })
}

module.exports = { dataPresensi, dataAbsensi, engine, updateAbsen }