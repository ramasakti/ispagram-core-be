const express = require('express')
const router = express.Router()
const CategoryController = require('../controller/CategoryController')

router.route('/kategori')
    .get(CategoryController.category)
    .post(CategoryController.store)

router.route('/kategori/:id_category')
    .put(CategoryController.update)

module.exports = router