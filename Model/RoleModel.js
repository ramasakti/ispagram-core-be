const getAllRole = async (trx) => await trx('role')

const getDetailRoleByIDRole = async (id_role, trx) => await trx('role').where('id_role', id_role).first()

const getRoleByRole = async (role, trx) => await trx('role').where('role', role).first()

module.exports = {
    getAllRole,
    getDetailRoleByIDRole,
    getRoleByRole
};
