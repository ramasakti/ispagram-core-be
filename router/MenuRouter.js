const express = require('express')
const router = express.Router()
const MenuController = require('../controller/MenuController')

router.route('/menu')
    .get(MenuController.getAllMenu)
    .post(MenuController.store)

router.route('/menu/update/:id_menu')
    .put(MenuController.update)

router.route('/menu/delete/:id_menu')
    .delete(MenuController.destroy)

router.route('/menu/:role')
    .get(MenuController.menu)

module.exports = router