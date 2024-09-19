const response = require('../Response')
const BlogModel = require('../Model/BlogModel')
const CategoryModel = require('../Model/CategoryModel')

const index = async (req, res) => {
    try {
        const jumbotron = await BlogModel.getArticleByStatus('Jumbotron', req.db)
        const second = await BlogModel.getArticleByStatus('Second', req.db)
        const third = await BlogModel.getArticleByStatusWithLimit('Third', 3, req.db)
        const popular = await BlogModel.getPopularArticle(5, req.db)
        const newest = await BlogModel.getNewestArticle(4, req.db)

        const data = { second, jumbotron, third, popular, newest }
        return response(200, data, ``, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const article = async (req, res) => {
    try {
        const articles = await BlogModel.getAllArticle(req.db)
        const parsed = articles.map(item => {
            let categories = []
            if (item.categories) {
                try {
                    const jsonString = '[' + item.categories.trim() + ']'
                    categories = JSON.parse(jsonString)
                } catch (parseError) {
                    console.error(`JSON parse error for categories: ${item.categories}`, parseError)
                }
            }

            return {
                ...item,
                categories: categories
            }
        })

        return response(200, parsed, 'Data Semua Artikel', res)
    } catch (error) {
        console.error(error)
        return response(500, null, 'Internal Server Error!', res)
    }
}

const detail = async (req, res) => {
    try {
        const slug = req.params.slug
        let article = await BlogModel.getArticleBySlug(slug, req.db)

        if (!article) return response(404, null, `Article Not Found`, res)

        const jsonString = '[' + article.categories.trim() + ']'
        const categories = JSON.parse(jsonString)
        
        let cat = []
        categories.map(item => {
            const b = article.categories = {
                label: item.name,
                value: item.id_category
            }
            cat.push(b)
        })

        article.categories = cat

        return response(200, article, `Artikel ${article.title}`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const store = async (req, res) => {
    try {
        const { slug, title, description, category, content, uploader, status } = req.body

        if (!slug || !title || !description || !content || !uploader || !status) return response(400, null, `Wajib Mengisi Semua Field!`, res)

        if (!req.file) return response(400, null, `Wajib Upload Banner!`, res)

        const banner = req.file.path
        if (!req.file.mimetype.startsWith('image/')) {
            return response(400, null, `File yang diunggah bukan gambar!`, res)
        }

        const statusArticle = BlogModel.getArticleByStatus(status, req.db)
        if (status === 'Third' && statusArticle.length > 2) return response(400, null, ``, res)
        if (status !== 'Third' && statusArticle.length > 1) return response(400, null, ``, res)

        
        category.forEach(async element => {
            const statusCategory = CategoryModel.getCategoryByCategory(element, req.db)
            if (!statusCategory) await CategoryModel.insertMasterCategory({ name: category }, req.db)
        });

        await BlogModel.insertArticle({
            slug, banner, title, description, category, content, uploader, status
        }, req.db)

        return response(201, req.body, `Berhasil Menambah Artikel`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const update = async (req, res) => {
    try {
        const slug = req.params.slug
        
        const { title, description, categories, content, status } = req.body

        if (req.file) {
            if (!req.file.mimetype.startsWith('image/')) {
                return response(400, null, `File yang diunggah bukan gambar!`, res)
            }

            const banner = req.file.path
            await BlogModel.updateArticleBySlug(slug, {
                banner, title, description, content, status
            }, req.db)
        }

        const statusArticle = BlogModel.getArticleByStatus(status, req.db)
        if (status === 'Third' && statusArticle.length > 2) return response(400, null, ``, res)
        if (status !== 'Third' && statusArticle.length > 1) return response(400, null, ``, res)

        console.log(req.body.categories);
        
        categories.forEach(async element => {
            const statusCategory = CategoryModel.getCategoryByCategory(element, req.db)
            if (!statusCategory) await CategoryModel.insertMasterCategory({ name: category }, req.db)
        });

        await BlogModel.updateArticleBySlug(slug, {
            title, description, content
        }, req.db)

        return response(201, {}, `Berhasil Update Data Artikel`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const destroy = async (req, res) => {
    try {
        const slug = req.params.slug

        await BlogModel.deleteArticleBySlug(slug, req.db)

        return response(201, {}, `Berhasil Delete Data Artikel`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const category = async (req, res) => {
    try {
        const id_category = req.params.id_category

        const featured = await BlogModel.getFeaturedArticleInCategory(id_category, req.db)
        const popular = await BlogModel.getPopularArticleInCategoryWithLimit(id_category, 5, req.db)
        const newest = await BlogModel.getNewestArticleInCategoryWithLimit(id_category, 3, req.db)

        const data = { featured, popular, newest }
        return response(200, data, ``, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const blogCategory = async (req, res) => {
    try {
        const id_category = req.params.id_category
        const blogCategory = await BlogModel.getArticleInCategory(id_category, req.db)

        return response(200, blogCategory, ``, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

module.exports = {
    index,
    article,
    detail,
    store,
    update,
    destroy,
    category,
    blogCategory
};
