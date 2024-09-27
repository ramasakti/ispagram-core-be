const getAllMasterCategory = async (trx) => {
    return await trx('master_category')
}

const getCategoryByCategory = async (category, trx) => await trx('master_category').where('name', category).first()

const insertMasterCategory = async (req, trx) => await trx('master_category').returning('id_category').insert(req)

const insertDataCategory = async (req, trx) => await trx('data_category').insert(req)

const updateMasterCategoryByID = async (id_category, req, trx) => await trx('master_category').where('id_category', id_category).update(req)

const deleteCategoryByBlogID = async (id_blog, trx) => await trx('data_category').where('blog_id', id_blog).del()

module.exports = {
    getAllMasterCategory,
    getCategoryByCategory,
    insertMasterCategory,
    insertDataCategory,
    updateMasterCategoryByID,
    deleteCategoryByBlogID
};
