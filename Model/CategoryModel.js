const db = require('../Config')

const getAllMasterCategory = async (trx = db) => {
    return await trx('master_category')
        .leftJoin('blog', 'blog.status', 'master_category.name')
}

const insertMasterCategory = async (req, trx = db) => await trx('master_category').insert(req)

const updateMasterCategoryByID = async (id_category, req, trx = db) => await trx('master_category').where('id_category', id_category).update(req)

module.exports = {
    getAllMasterCategory,
    insertMasterCategory,
    updateMasterCategoryByID
};
