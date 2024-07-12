const db = require('../Config')

const getAllAlumni = async (trx = db) => {
    return await trx('detail_siswa')
        .whereNotIn('id_siswa', db.select('id_siswa').from('siswa'))
}

const insertAlumni = async (trx = db) => {
    return await trx('alumni').insert(req)
}

module.exports = {
    getAllAlumni, insertAlumni
};
