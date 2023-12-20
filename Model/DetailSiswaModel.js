const db = require('../Config')

const insertDetailSiswa = async (id_siswa) => await db('detail_siswa').insert({ siswa_id: id_siswa })

module.exports = {
    insertDetailSiswa
};
