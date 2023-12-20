const db = require('../Config')

const getAllSubmenuWithMenu = async () => {
    return await db('submenu')
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

const getSubmenuByMenu = async (menu) => await db('submenu').where('menu_id', menu)

const getSubmenuByID = async (id_submenu) => await db('submenu').where('id_submenu', id_submenu).first()

const insertSubmenu = async (req) => {
    return await db('submenu').insert(req)
}

const updateSubmenu = async (id_submenu, req) => await db('submenu').where('id_submenu', id_submenu).update(req)

const deleteSubmenuByID = async (id_submenu) => await db('submenu').where('id_submenu', id_submenu).del()

const deleteSubmenuByMenu = async (menu) => await db('submenu').where('menu_id', menu).del()

module.exports = {
    getAllSubmenuWithMenu,
    getSubmenuByMenu,
    getSubmenuByID,
    insertSubmenu,
    updateSubmenu,
    deleteSubmenuByID,
    deleteSubmenuByMenu
};
