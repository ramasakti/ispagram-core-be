const db = require('../Config')

const getAllJampel = async (trx = db) => await trx('jam_pelajaran')

const getAllJampelActive = async (trx = db) => {
    return await trx('jam_pelajaran')
        .whereNot('keterangan', 'like', '%Istirahat%')
        .whereNot('keterangan', 'like', '%Diniyah%')
        .whereNotIn('id_jampel', trx.raw('SELECT jampel FROM jadwal'))
        .orderBy('id_jampel', 'ASC')
        .orderBy('mulai', 'ASC')
}

const getAllAvailableJampel = async (trx = db) => {
    return await trx('jam_pelajaran')
        .select('id_jampel')
        .whereNotIn('id_jampel', trx.raw('SELECT jampel FROM jadwal'))
}

const getJampelByHari = async (hari, trx = db) => {
    return await trx('jam_pelajaran').where('hari', hari).first()
}

module.exports = {
    getAllJampel,
    getAllJampelActive,
    getAllAvailableJampel,
    getJampelByHari
};
