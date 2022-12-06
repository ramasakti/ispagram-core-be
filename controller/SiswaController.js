const db = require('./../Config')
const response = require('./../Response')

const allSiswa = (req, res) => {
    const sql = `SELECT * FROM siswa`
    db.query(sql, (err, field) => {
        if (err) throw err
        return response(200, field, 'Get Data Siswa', res)
    })
}

const detailSiswa = (req, res) => {
    const idSiswa = req.params.id_siswa
    const sql = `SELECT * FROM siswa WHERE id_siswa = '${idSiswa}'`
    db.query(sql, (err, field) => {
        if (err) throw err
        return response(200, field, 'Get Detail Siswa', res)
    })
}

const storeSiswa = (req, res) => {
    const { id_siswa, nama_siswa, kelas_id, alamat, telp, tempat_lahir, tanggal_lahir } = req.body
    const sql = `INSERT INTO siswa (id_siswa, nama_siswa, kelas_id, alamat, telp, tempat_lahir, tanggal_lahir) VALUES ('${id_siswa}', '${nama_siswa}', ${kelas_id}, '${alamat}', '${telp}', '${tempat_lahir}', '${tanggal_lahir}')`
    db.query(sql, (err, field) => {
        if (err) throw err
        return response(201, field, 'Berhasil menambahkan data siswa!', res)
    })
}

const updateSiswa = (req, res) => {
    const idSiswa = req.params.id_siswa
    const { idBaru, nama_siswa, kelas_id, alamat, telp, tempat_lahir, tanggal_lahir } = req.body
    const sql = `UPDATE siswa SET id_siswa = '${idBaru}', nama_siswa = '${nama_siswa}', kelas_id = '${kelas_id}', alamat = '${alamat}', telp = '${telp}', tempat_lahir = '${tempat_lahir}', tanggal_lahir = '${tanggal_lahir}' WHERE id_siswa = '${idSiswa}'`
    db.query(sql, (err, field) => {
        if (err) throw err
        return response(201, field, 'Berhasil update data siswa!', res)
    })
}

const deleteSiswa = (req, res) => {
    const idSiswa = req.params.id_siswa
    const sql = `DELETE FROM siswa WHERE id_siswa = '${idSiswa}'`
    db.query(sql, (err, field) => {
        if (err) throw err
        return response(200, field, 'Berhasil delete siswa!', res)
    })
}

module.exports = { allSiswa, detailSiswa, storeSiswa, updateSiswa, deleteSiswa }