const db = require('../Config')

const getAllJampel = async (trx = db) => await trx('jam_pelajaran')

const getJampelByHari = async (hari, trx = db) => {
    return await trx('jam_pelajaran').where('hari', hari).first()
}

module.exports = {
    getAllJampel,
    getJampelByHari
};
