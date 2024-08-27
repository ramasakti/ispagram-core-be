const getAllArticle = async (trx) => {
    return await trx('blog')
        .select(
            'blog.*',
            trx.raw('GROUP_CONCAT(JSON_OBJECT(' +
                '"id_category", master_category.id_category, ' +
                '"name", master_category.name' +
                ')) as categories')
        )
        .leftJoin('data_category', 'blog.id_blog', 'data_category.blog_id')
        .leftJoin('master_category', 'data_category.category_id', 'master_category.id_category')
        .orderBy('status', 'asc')
        .orderBy('created_at', 'asc')
        .groupBy('blog.id_blog')
}

const getArticleBySlug = async (slug, trx) => {
    return await trx('blog')
        .select(
            'blog.*',
            trx.raw('GROUP_CONCAT(JSON_OBJECT(' +
                '"id_category", master_category.id_category, ' +
                '"name", master_category.name' +
                ')) as categories')
        )
        .join('data_category', 'blog.id_blog', 'data_category.blog_id')
        .join('master_category', 'data_category.category_id', 'master_category.id_category')
        .where('blog.slug', slug)
        .groupBy('blog.id_blog')
        .first();
}

const getArticleByStatus = async (status, trx) => await trx('blog').where('status', status).first()

const getPopularArticle = async (limit, trx) => await trx('blog').orderBy('hit', 'desc').limit(limit)

const getArticleByStatusWithLimit = async (status, limit, trx) => await trx('blog').where('status', status).limit(limit)

const getSimilarArticle = async (trx) => await trx('blog').where()

const getNewestArticle = async (limit, trx) => await trx('blog').orderBy('created_at', 'asc').limit(limit)

const insertArticle = async (req, trx) => await trx('blog').insert(req)

const updateArticleBySlug = async (slug, req, trx) => await trx('blog').where('slug', slug).update(req)

const updateArticleByID = async (id_blog, req, trx) => await trx('blog').where('id_blog', id_blog).update(req)

const deleteArticleBySlug = async (slug, trx) => await trx('blog').where('slug', slug).del()

const getAllCategory = async (trx) => await trx('master_category')

const getCategoryByID = async (id_category, trx) => await trx('master_category').where('id_category', id_category).first()

const getArticleInCategory = async (id_category, trx) => {
    return await trx('blog')
        .select(
            'blog.id_blog',
            'blog.title',
            'master_category.name'
        )
        .join('data_category', 'blog.id_blog', 'data_category.blog_id')
        .join('master_category', 'data_category.category_id', 'master_category.id_category')
        .where('master_category.id_category', id_category)
        .orderBy('blog.hit', 'desc')
}

const getFeaturedArticleInCategory = async (id_category, trx) => {
    return await trx('blog')
        .join('data_category', 'blog.id_blog', 'data_category.blog_id')
        .join('master_category', 'data_category.category_id', 'master_category.id_category')
        .select(
            'blog.id_blog',
            'blog.slug',
            'blog.banner',
            'blog.title',
            'blog.description',
            'blog.content',
            'blog.uploader',
            'blog.status',
            'blog.hit',
            'blog.created_at',
            'blog.updated_at',
            'master_category.name as category_name'
        )
        .where('blog.status', '=', trx.raw('master_category.name'))
        .andWhere('data_category.category_id', '=', id_category)
        .first();
}

const getPopularArticleInCategoryWithLimit = async (id_category, limit, trx) => {
    return await trx('blog')
        .select(
            'blog.id_blog',
            'blog.slug',
            'blog.banner',
            'blog.title',
            'blog.description',
            'blog.content',
            'blog.uploader',
            'blog.status',
            'blog.hit',
            'blog.created_at',
            'blog.updated_at',
            'master_category.name as category_name'
        )
        .join('data_category', 'blog.id_blog', 'data_category.blog_id')
        .join('master_category', 'data_category.category_id', 'master_category.id_category')
        .where('data_category.category_id', id_category)
        .orderBy('blog.hit', 'desc')
        .limit(limit)
}

const getNewestArticleInCategoryWithLimit = async (id_category, limit, trx) => {
    return await trx('blog')
        .select(
            'blog.id_blog',
            'blog.slug',
            'blog.banner',
            'blog.title',
            'blog.description',
            'blog.content',
            'blog.uploader',
            'blog.status',
            'blog.hit',
            'blog.created_at',
            'blog.updated_at',
            'master_category.name as category_name'
        )
        .join('data_category', 'blog.id_blog', 'data_category.blog_id')
        .join('master_category', 'data_category.category_id', 'master_category.id_category')
        .where('data_category.category_id', id_category)
        .orderBy('blog.created_at', 'asc')
        .limit(limit)
}

module.exports = {
    getAllArticle,
    getArticleByStatus,
    getPopularArticle,
    getArticleByStatusWithLimit,
    getSimilarArticle,
    getNewestArticle,
    getArticleBySlug,
    insertArticle,
    updateArticleBySlug,
    updateArticleByID,
    deleteArticleBySlug,
    getAllCategory,
    getCategoryByID,
    getNewestArticle,
    getArticleInCategory,
    getFeaturedArticleInCategory,
    getPopularArticleInCategoryWithLimit,
    getNewestArticleInCategoryWithLimit
};
