const getAllMasterCategory = async (trx) => {
    return await trx('master_category')
}

const insertMasterCategory = async (req, trx) => await trx('master_category').insert(req)

const updateMasterCategoryByID = async (id_category, req, trx) => await trx('master_category').where('id_category', id_category).update(req)

module.exports = {
    getAllMasterCategory,
    insertMasterCategory,
    updateMasterCategoryByID
};
