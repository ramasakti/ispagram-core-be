const response = require('../Response')
const RoleModel = require('../Model/RoleModel')

const role = async (req, res) => {
    try {
        const role = await RoleModel.getAllRole()
        return response(200, role, ``, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const detail = async (req, res) => {
    try {
        const role = req.params.role
        const data = await RoleModel.getDetailRoleByRole(role)
        return response(200, data, ``, res)
    } catch (error) {
        return response(500, null, `Internal Server Error!`, res)
    }
}

module.exports = {
    role,
    detail
};
