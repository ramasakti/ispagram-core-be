const db = require('../Config')

const getAllMenu = async (trx = db) => await trx('menu')

const getAllMenuWithSection = async (trx = db) => {
    return await trx('menu')
        .select(
            'menu.type',
            'menu.id_menu',
            'menu.name as menu',
            'menu.route',
            'menu.order',
            'section.id_section',
            'section.name as section',
        )
        .leftJoin('section', 'section.id_section', '=', 'menu.section_id')
        .orderBy('section.order', 'ASC')
        .orderBy('menu.order', 'ASC')
}

const getMenuByID = async (id_menu, trx = db) => await trx('menu').where('id_menu', id_menu).first()

const getMenuByRole = async (role, trx = db) => {
    return await trx('navbar')
        .select(
            'menu.id_menu',
            'menu.route',
            'menu.name as menu',
            'section.name as section',
        )
        .join('menu', 'menu.id_menu', '=', 'navbar.menu_id')
        .leftJoin('section', 'section.id_section', '=', 'menu.section_id')
        .where('navbar.role_id', role)
}

const getSubmenuByRole = async (menu_id, trx = db) => await trx('submenu').where('menu_id', menu_id)

const insertMenu = async (req, trx = db) => await trx('menu').insert(req)

const updateMenu = async (id_menu, req, trx = db) => await trx('menu').where('id_menu', id_menu).update(req)

const deleteMenu = async (id_menu, trx = db) => await trx('menu').where('id_menu', id_menu).del()

module.exports = {
    getAllMenu,
    getAllMenuWithSection,
    getMenuByID,
    getMenuByRole,
    getSubmenuByRole,
    insertMenu,
    updateMenu,
    deleteMenu
};
