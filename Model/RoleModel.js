const db = require('../Config')

const getAllRole = async (trx = db) => await trx('role')

const getDetailRoleByIDRole = async (id_role, trx = db) => await trx('role').where('id_role', id_role).first()

const getRoleByRole = async (role, trx = db) => await trx('role').where('role', role).first()

module.exports = {
    getAllRole,
    getDetailRoleByIDRole,
    getRoleByRole
};
