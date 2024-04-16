const db = require('../Config')

const getAllSubmenuWithMenu = async (trx = db) => {
    return await trx('submenu')
        .select(
            'submenu.id_submenu',
            'submenu.name as submenu',
            'submenu.route as route',
            'submenu.order',
            'menu.id_menu',
            'menu.name as menu'
        )
        .join('menu', 'menu.id_menu', '=', 'submenu.menu_id')
}

const getSubmenuByMenu = async (menu, trx = db) => await trx('submenu').where('menu_id', menu)

const getSubmenuByID = async (id_submenu, trx = db) => await trx('submenu').where('id_submenu', id_submenu).first()

const insertSubmenu = async (req, trx = db) => await trx('submenu').insert(req)

const updateSubmenu = async (id_submenu, req, trx = db) => await trx('submenu').where('id_submenu', id_submenu).update(req)

const deleteSubmenuByID = async (id_submenu, trx = db) => await trx('submenu').where('id_submenu', id_submenu).del()

const deleteSubmenuByMenu = async (menu, trx = db) => await trx('submenu').where('menu_id', menu).del()

module.exports = {
    getAllSubmenuWithMenu,
    getSubmenuByMenu,
    getSubmenuByID,
    insertSubmenu,
    updateSubmenu,
    deleteSubmenuByID,
    deleteSubmenuByMenu
};
