const db = require('./Config')

const sql = `SELECT * FROM siswa`
const allSiswa = db.query(sql, (err, res) => {
    if (err) throw err
    return res
})

module.exports = {allSiswa}