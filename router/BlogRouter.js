const express = require('express')
const router = express.Router()
const BlogController = require('../controller/BlogController')

const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })

router.route('/api/blog')
    .get(BlogController.index)
    
router.route('/blog')
    .get(BlogController.article)
    .post(upload.single('banner'), BlogController.store)

router.route('/blog/:slug')
    .get(BlogController.detail)
    .put(BlogController.update)
    .delete(BlogController.destroy)

router.route('/category/:id_category')
    .get(BlogController.category)

router.route('/blog/category/:id_category')
    .get(BlogController.blogCategory)

module.exports = router