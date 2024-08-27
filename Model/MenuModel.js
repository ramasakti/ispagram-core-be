const getAllMenuWithSectionByRole = async (role, trx) => {
    return await trx('menu')
        .select(
            'menu.id_menu',
            'menu.name as menu',
            'menu.route',
            'section.name as section',
            trx.raw('CASE WHEN COALESCE(navbar.id_navbar, NULL) THEN TRUE ELSE FALSE END AS navbar')
        )
        .leftJoin('section', 'section.id_section', '=', 'menu.section_id')
        .leftJoin(trx('navbar').where('role_id', role).as('navbar'), 'navbar.menu_id', '=', 'menu.id_menu')
}

const getAllMenuWithSection = async (trx) => {
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

const getMenuByID = async (id_menu, trx) => await trx('menu').where('id_menu', id_menu).first()

const getMenuByRole = async (role, trx) => {
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

const getSubmenuByRole = async (menu_id, trx) => await trx('submenu').where('menu_id', menu_id)

const insertMenu = async (req, trx) => await trx('menu').insert(req)

const updateMenu = async (id_menu, req, trx) => await trx('menu').where('id_menu', id_menu).update(req)

const deleteMenu = async (id_menu, trx) => await trx('menu').where('id_menu', id_menu).del()

module.exports = {
    getAllMenuWithSectionByRole,
    getAllMenuWithSection,
    getMenuByID,
    getMenuByRole,
    getSubmenuByRole,
    insertMenu,
    updateMenu,
    deleteMenu
};
