const db = require('../Config')

const getAllArticle = async (trx = db) => await trx('blog')

const getArticleBySlug = async (slug, trx = db) => await trx('blog').where('slug', slug).first()

const insertArticle = async (req, trx = db) => await trx('blog').insert(req)

const updateArticleBySlug = async (slug, req, trx = db) => await trx('blog').where('slug', slug).update(req)

const deleteArticleBySlug = async (slug, trx = db) => await trx('blog').where('slug', slug).del()

module.exports = {
    getAllArticle,
    getArticleBySlug,
    insertArticle,
    updateArticleBySlug,
    deleteArticleBySlug
};
