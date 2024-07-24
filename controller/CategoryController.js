const response = require('../Response')
const BlogModel = require('../Model/BlogModel')
const CategoryModel = require('../Model/CategoryModel')

const category = async (req, res) => {
    try {
        const category = await CategoryModel.getAllMasterCategory()

        return response(200, category, ``, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const store = async (req, res) => {
    try {
        const { name, featured } = req.body

        if (!name) return response(400, null, `Gagal! Wajib Mengisi Nama Kategori`)

        await CategoryModel.insertMasterCategory({ name })

        if (featured) await BlogModel.updateArticleByID(featured, { status: name })

        return response(201, {}, `Berhasil menambah kategori baru!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const update = async (req, res) => {
    try {
        const id_category = req.params.id_category
        const { name, featured } = req.body

        if (name) await CategoryModel.updateMasterCategoryByID(id_category, { name })
        if (featured) await BlogModel.updateArticleByID(featured, { status: name })
        
        return response(201, {}, `Berhasil Update Kategori`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

module.exports = {
    category,
    store,
    update
};
