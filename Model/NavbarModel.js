const db = require('../Config')
const Moment = require('./../utilities/Moment')

const getNavbarByRole = async (role, trx = db) => {
    return await trx('navbar')
        .select(
            'navbar.id_navbar', 
            'menu.id_menu', 
            'menu.name as menu_name', 
            'menu.route as menu_route', 
            'section.name as section_name', 
            'section.icon as section_icon',
            'role.role'
        )
        .join('role', 'role.id_role', '=', 'navbar.role_id')
        .leftJoin('menu', 'navbar.menu_id', 'menu.id_menu')
        .leftJoin('section', 'menu.section_id', 'section.id_section')
        .where('navbar.role_id', role)
        .orderBy('section.order', 'ASC')
        .orderBy('menu.order', 'ASC')
}

const deleteNavbarByID = async (id_navbar, trx = db) => await trx('navbar').where('id_navbar', id_navbar).del()

const deleteNavbarByMenu = async (menu, trx = db) => await trx('navbar').where('menu_id', menu).del()

const deleteNavbarByMenuAndRole = async (menu, role, trx = db) => await trx('navbar').where('menu_id', menu).where('role_id', role).del()

const insertNavbar = async (req, trx = db) => await trx('navbar').insert(req)

const getSubmenu = async (trx = db) => await trx('submenu').orderBy('order', 'ASC')

module.exports = {
    getNavbarByRole,
    deleteNavbarByID,
    deleteNavbarByMenu,
    deleteNavbarByMenuAndRole,
    insertNavbar,
    getSubmenu
};
