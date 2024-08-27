const getAllTransportasi = async (trx) => await trx('transportasi')

const getTransportasiByID = async (id_transport, trx) => await trx('transportasi').where('id_transport', id_transport).first() 

const getAllJeting = async (trx) => await trx('jenis_tinggal')

const getJetingByID = async (id_jeting, trx) => await trx('jenis_tinggal').where('id_jeting', id_jeting).first()

const getAllPendidikan = async (trx) => await trx('pendidikan')

const getPendidikanByID = async (id_pendidikan, trx) => await trx('pendidikan').where('id_pendidikan', id_pendidikan).first()

const getAllProfesi = async (trx) => await trx('profesi')

const getProfesiByID = async (id_profesi, trx) => await trx('profesi').where('id_profesi', id_profesi).first()

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
