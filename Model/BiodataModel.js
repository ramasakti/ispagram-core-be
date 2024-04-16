const db = require('../Config')

const getAllTransportasi = async (trx = db) => await trx('transportasi')

const getTransportasiByID = async (id_transport, trx = db) => {
    return await trx('transportasi').where('id_transport', id_transport).first() 
}

const getAllJeting = async (trx = db) => await trx('jenis_tinggal')

const getJetingByID = async (id_jeting, trx = db) => {
    return await trx('jenis_tinggal').where('id_jeting', id_jeting).first()
}

const getAllPendidikan = async (trx = db) => await trx('pendidikan')

const getPendidikanByID = async (id_pendidikan, trx = db) => {
    return await trx('pendidikan').where('id_pendidikan', id_pendidikan).first()
}

const getAllProfesi = async (trx = db) => await trx('profesi')

const getProfesiByID = async (id_profesi, trx = db) => {
    return await trx('profesi').where('id_profesi', id_profesi).first()
}

module.exports = {
    getAllTransportasi,
    getTransportasiByID,
    getAllJeting,
    getJetingByID,
    getAllPendidikan,
    getPendidikanByID,
    getAllProfesi,
    getProfesiByID
};
