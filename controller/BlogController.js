const response = require('../Response')
const BlogModel = require('../Model/BlogModel')

const article = async (req, res) => {
    try {
        const articles = await BlogModel.getAllArticle()

        return response(200, articles, `Data Semua Artikel`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const detail = async (req, res) => {
    try {
        const slug = req.params.slug
        const article = await BlogModel.getArticleBySlug(slug)

        if (!article) return response(404, null, `Article Not Found`, res)

        return response(200, article, `Artikel ${article.title}`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const store = async (req, res) => {
    try {
        const { slug, title, description, content, uploader } = req.body

        if (!req.file) return response(400, null, `Wajib Upload Banner!`, res)

        const banner = req.file.path
        if (!req.file.mimetype.startsWith('image/')) {
            return response(400, null, `File yang diunggah bukan gambar!`, res)
        }

        await BlogModel.insertArticle({
            slug, banner, title, description, content, uploader
        })

        return response(201, {}, `Berhasil Menambah Artikel`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const update = async (req, res) => {
    try {
        const slug = req.params.slug
        const { title, description, content } = req.body

        if (req.file) {
            if (!req.file.mimetype.startsWith('image/')) {
                return response(400, null, `File yang diunggah bukan gambar!`, res)
            }
            
            const banner = req.file.path
            await BlogModel.updateArticleBySlug(slug, {
                banner, title, description, content
            })
        }

        await BlogModel.updateArticleBySlug(slug, {
            title, description, content
        })
        
        return response(201, {}, `Berhasil Update Data Artikel`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const destroy = async (req, res) => {
    try {
        const slug = req.params.slug

        await BlogModel.deleteArticleBySlug(slug)

        return response(201, {}, `Berhasil Delete Data Artikel`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

module.exports = {
    article,
    detail,
    store,
    update,
    destroy
};
