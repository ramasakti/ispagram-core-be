const getAllMapel = async (trx) => await trx('mapel')

const getMapelByID = async (id_mapel, trx) => await trx('mapel').where('id_mapel', id_mapel).first()

const insertMapel = async (req, trx) => await trx('mapel').insert(req)

const updateMapel = async (id_mapel, req, trx) => await trx('mapel').where('id_mapel', id_mapel).update(req)

const deleteMapel = async (id_mapel, trx) => await trx('mapel').where('id_mapel', id_mapel).del()

module.exports = {
    getAllMapel,
    getMapelByID,
    insertMapel,
    updateMapel,
    deleteMapel
};
