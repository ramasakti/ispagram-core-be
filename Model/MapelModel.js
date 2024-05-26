const db = require('../Config')

const getAllMapelWithKelas = async (trx = db) => await trx('mapel').join('kelas', 'kelas.id_kelas', '=', 'mapel.kelas_id')

const getAllMapelWithKelasByKelas = async (kelas_id, trx = db) => await trx('mapel').join('kelas', 'kelas.id_kelas', '=', 'mapel.kelas_id').where('kelas_id', kelas_id)

const getMapelByID = async (id_mapel, trx = db) => await trx('mapel').where('id_mapel', id_mapel).first()

const insertMapel = async (req, trx = db) => await trx('mapel').insert(req)

const updateMapel = async (id_mapel, req, trx = db) => await trx('mapel').where('id_mapel', id_mapel).update(req)

const deleteMapel = async (id_mapel, trx = db) => await trx('mapel').where('id_mapel', id_mapel).del()

module.exports = {
    getAllMapelWithKelas,
    getAllMapelWithKelasByKelas,
    getMapelByID,
    insertMapel,
    updateMapel,
    deleteMapel
};
