const db = require('../Config')
const Moment = require('./../utilities/Moment')

const getAccessByRole = async (role, trx = db) => {
    return await trx('access')
        .select(
            'access.*',
            'menu.id_menu',
            'menu.name as menu',
            'menu.id_menu',
        )
        .join('menu', 'menu.id_menu', '=', 'access.menu_id')
        .where('access.role_id', role)
}

module.exports = {
    getAccessByRole
};
