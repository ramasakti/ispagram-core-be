const db = require('../Config')

const getAllAlumni = async (trx = db) => {
    return await trx('detail_siswa')
        .join('alumni', 'alumni.nis', '=', 'detail_siswa.id_siswa')
        .whereNotIn('id_siswa', db.select('id_siswa').from('siswa'))
}

const getAlumniByTahunLulus = async (tahun, trx = db) => {
    return await trx('alumni')
        .join('detail_siswa', 'detail_siswa.id_siswa', '=', 'alumni.nis')
        .where('alumni.tahun', tahun)
}

const insertAlumni = async (req, trx = db) => await trx('alumni').insert(req)

const updateAlumni = async (nis, req, trx = db) => await trx('alumni').where('nis', nis).update({ req })

module.exports = {
    getAllAlumni, insertAlumni, getAlumniByTahunLulus, updateAlumni
};
