const db = require('../Config')

const getAllRole = async () => await db('role')

const getDetailRoleByRole = async (role) => {
    return await db('role').where('id_role', role).first()
}

module.exports = {
    getAllRole,
    getDetailRoleByRole
};
