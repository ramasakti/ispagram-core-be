const db = require('../Config')
const response = require('../Response')
const moment = require('../utilities/Moment')
const AccessModel = require('../Model/AccessModel')

const access = async (req, res) => {
    try {
        const role = req.params.role
        const access = await AccessModel.getAccessByRole(role, req.db)

        return response(200, access, ``, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const store = async (req, res) => {
    
}

module.exports = {
    access
};
