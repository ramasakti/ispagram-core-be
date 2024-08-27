const getAllNavland = async (trx) => await trx('navland')

const insertNavland = async (req, trx) => await trx('navland').insert(req)

const updateNavland = async (id_navland, req, trx) => await trx('navland').where('id_navland', id_navland).update(req)

const deleteNavland = async (id_navland, trx) => await trx('navland').where('id_navland', id_navland).del()

module.exports = {
    getAllNavland,
    insertNavland,
    updateNavland,
    deleteNavland
};
