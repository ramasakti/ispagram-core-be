const getAllJampel = async (trx) => await trx('jam_pelajaran')

const getAllJampelActive = async (trx) => {
    return await trx('jam_pelajaran')
        .whereNot('keterangan', 'like', '%Istirahat%')
        .whereNot('keterangan', 'like', '%Diniyah%')
        .whereNotIn('id_jampel', trx.raw('SELECT jampel FROM jadwal'))
        .orderBy('id_jampel', 'ASC')
        .orderBy('mulai', 'ASC')
}

const getAllJampelFilledByKelas = async (kelas, trx) => {
    return trx('jadwal')
        .select('jadwal.jampel')
        .join('jam_pelajaran', 'jam_pelajaran.id_jampel', '=', 'jadwal.jampel')
        .join('mapel', 'mapel.id_mapel', '=', 'jadwal.mapel')
        .where('jadwal.kelas_id', kelas)
}

const getAllJampelFreeByFilled = async (filled, trx) => {
    return trx('jam_pelajaran')
        .whereNotIn('id_jampel', filled)
        .whereNot('keterangan', 'like', '%Istirahat%')
        .whereNot('keterangan', 'like', '%Diniyah%')
}

const getAllTrueJampel = async (trx) => {
    return await trx('jam_pelajaran')
        .whereNot('keterangan', 'like', '%Istirahat%')
        .whereNot('keterangan', 'like', '%Diniyah%')
        .orderBy('id_jampel', 'ASC')
        .orderBy('mulai', 'ASC')
}

const getJampelInID = async (id_jampel, trx) => {
    return await db('jam_pelajaran')
        .select('keterangan')
        .whereIn('id_jampel', id_jampel)
}

const getAllAvailableJampel = async (trx) => {
    return await trx('jam_pelajaran')
        .select('id_jampel')
        .whereNotIn('id_jampel', trx.raw('SELECT jampel FROM jadwal'))
}

const getJampelByTimeAndHari = async (mulai, selesai, hari, trx) => {
    return await trx('jam_pelajaran')
        .where(function (query) {
            query
                .where(function (subquery) {
                    subquery
                        .where('mulai', '<', mulai)
                        .andWhere('selesai', '>', mulai)
                })
                .orWhere(function (subquery) {
                    subquery
                        .where('mulai', '<', selesai)
                        .andWhere('selesai', '>', selesai)
                })
        })
        .where('hari', hari)
}

const getJampelByHari = async (hari, trx) => await trx('jam_pelajaran').where('hari', hari).first()

const insertJampel = async (req, trx) => await trx('jam_pelajaran').insert(req)

const updateJampelByID = async (id_jampel, req, trx) => await trx('jam_pelajaran').where('id_jampel', id_jampel).update(req)

const deleteJampelByID = async (id_jampel, trx) => await trx('jam_pelajaran').where('id_jampel', id_jampel).del()

const getJampelByID = async (id_jampel, trx) => await trx('jam_pelajaran').where('id_jampel', id_jampel).first()

module.exports = {
    getAllJampel,
    getAllJampelActive,
    getAllJampelFilledByKelas,
    getAllJampelFreeByFilled,
    getAllTrueJampel,
    getJampelInID,
    getAllAvailableJampel,
    getJampelByTimeAndHari,
    getJampelByHari,
    insertJampel,
    updateJampelByID,
    deleteJampelByID,
    getJampelByID
};
