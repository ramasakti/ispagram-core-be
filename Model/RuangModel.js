const getAllRuang = async (trx) => await trx('ruang')

const insertRuang = async (req, trx) => await trx('ruang').insert(req)

const updateRuangByID = async (id_ruang, req, trx) => await trx('ruang').where('id_ruang', id_ruang).update(req)

const deleteRuangByID = async (id_ruang, trx) => await trx('ruang').where('id_ruang', id_ruang).del()

module.exports = {
    getAllRuang,
    insertRuang,
    updateRuangByID,
    deleteRuangByID
};
