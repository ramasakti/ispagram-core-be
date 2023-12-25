const db = require('../Config')
const Moment = require('./../Utilities/Moment')

const getNavbarByRole = async (role) => {
    return await db('navbar')
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

const deleteNavbarByID = async (id_navbar) => {
    return await db('navbar').where('id_navbar', id_navbar).del()
}
const deleteNavbarByMenu = async (menu) => {
    return await db('navbar').where('menu_id', menu).del()
}

const deleteNavbarByMenuAndRole = async (menu, role) => {
    return await db('navbar').where('menu_id', menu).where('role_id', role).del()
}

const insertNavbar = async (req) => {
    return await db('navbar').insert(req)
}

const getSubmenu = async () => await db('submenu').orderBy('order', 'ASC')

module.exports = {
    getNavbarByRole,
    deleteNavbarByID,
    deleteNavbarByMenu,
    deleteNavbarByMenuAndRole,
    insertNavbar,
    getSubmenu
};
