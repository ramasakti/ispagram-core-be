const express = require('express')
const router = express.Router()
const BlogController = require('../controller/BlogController')

const multer = require('multer')
const path = require('path')
const os = require('os')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const tempDir = os.tmpdir()
        cb(null, tempDir);
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
    .put(upload.single('banner'), BlogController.update)
    .delete(BlogController.destroy)

router.route('/category/:id_category')
    .get(BlogController.category)

module.exports = router