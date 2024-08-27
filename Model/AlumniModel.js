const getAllAlumni = async (trx) => {
    return await trx('detail_siswa')
        .join('alumni', 'alumni.nis', '=', 'detail_siswa.id_siswa')
        .whereNotIn('id_siswa', trx.select('id_siswa').from('siswa'))
}

const getAlumniByTahunLulus = async (tahun, trx) => {
    return await trx('alumni')
        .join('detail_siswa', 'detail_siswa.id_siswa', '=', 'alumni.nis')
        .where('alumni.tahun', tahun)
}

const insertAlumni = async (req, trx) => await trx('alumni').insert(req)

const updateAlumni = async (nis, req, trx) => await trx('alumni').where('nis', nis).update({ req })

module.exports = {
    getAllAlumni, insertAlumni, getAlumniByTahunLulus, updateAlumni
};
