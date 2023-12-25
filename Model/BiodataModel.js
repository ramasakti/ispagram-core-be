const db = require('../Config')

const getAllTransportasi = async () => await db('transportasi')

const getTransportasiByID = async (id_transport) => {
    return await db('transportasi').where('id_transport', id_transport).first() 
}

const getAllJeting = async () => await db('jenis_tinggal')

const getJetingByID = async (id_jeting) => {
    return await db('jenis_tinggal').where('id_jeting', id_jeting).first()
}

const getAllPendidikan = async () => await db('pendidikan')

const getPendidikanByID = async (id_pendidikan) => {
    return await db('pendidikan').where('id_pendidikan', id_pendidikan).first()
}

const getAllProfesi = async () => await db('profesi')

const getProfesiByID = async (id_profesi) => {
    return await db('profesi').where('id_profesi', id_profesi).first()
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
