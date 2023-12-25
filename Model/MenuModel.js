const db = require('../Config')

const getAllMenu = async () => await db('menu')

const getAllMenuWithSection = async () => {
    return await db('menu')
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

const getMenuByID = async (id_menu) => {
    return await db('menu').where('id_menu', id_menu).first()
}

const getMenuByRole = async (role) => {
    return await db('navbar')
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

const getSubmenuByRole = async (menu_id) => {
    return await db('submenu').where('menu_id', menu_id)
}

const insertMenu = async (req) => {
    return await db('menu').insert(req)
}

const updateMenu = async (id_menu, req) => {
    return await db('menu').where('id_menu', id_menu).update(req)
}

const deleteMenu = async (id_menu) => {
    return await db('menu').where('id_menu', id_menu).del()
}

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
