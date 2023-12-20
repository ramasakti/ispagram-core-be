const express = require('express')
const router = express.Router()
const SubmenuController = require('../Controller/SubmenuController')

router.route('/submenu')
    .get(SubmenuController.submenu)
    .post(SubmenuController.store)

router.route('/submenu/:id_submenu')
    .put(SubmenuController.update)
    .delete(SubmenuController.destroy)

module.exports = router