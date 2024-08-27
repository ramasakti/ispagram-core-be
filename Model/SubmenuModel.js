const getAllSubmenuWithMenu = async (trx) => {
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

const getSubmenuByMenu = async (menu, trx) => await trx('submenu').where('menu_id', menu)

const getSubmenuByID = async (id_submenu, trx) => await trx('submenu').where('id_submenu', id_submenu).first()

const insertSubmenu = async (req, trx) => await trx('submenu').insert(req)

const updateSubmenu = async (id_submenu, req, trx) => await trx('submenu').where('id_submenu', id_submenu).update(req)

const deleteSubmenuByID = async (id_submenu, trx) => await trx('submenu').where('id_submenu', id_submenu).del()

const deleteSubmenuByMenu = async (menu, trx) => await trx('submenu').where('menu_id', menu).del()

module.exports = {
    getAllSubmenuWithMenu,
    getSubmenuByMenu,
    getSubmenuByID,
    insertSubmenu,
    updateSubmenu,
    deleteSubmenuByID,
    deleteSubmenuByMenu
};
