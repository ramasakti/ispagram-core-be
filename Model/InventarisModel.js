const getAllInventaris = async (trx) => await trx('inventaris')

const getAllInventarisByRuang = async (id_ruang, trx) => await trx('inventaris').where('ruang_id', id_ruang)

const insertInventaris = async (req, trx) => await trx('inventaris').insert(req)

const updateInventarisByID = async (id_inventaris, req, trx) => await trx('inventaris').where('id_inventaris', id_inventaris).update(req)

const deleteInventarisByID = async (id_inventaris, trx) => await trx('inventaris').where('id_inventaris', id_inventaris).del()

module.exports = {
    getAllInventaris,
    getAllInventarisByRuang,
    insertInventaris,
    updateInventarisByID,
    deleteInventarisByID
};
