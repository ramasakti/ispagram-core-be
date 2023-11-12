const db = require('./../Config')
const response = require('./../Response')

const navbar = async (req, res) => {
    const role = req.params.role

    const navbar = await db('navbar').where('role', role).first()

    return response(200, navbar, ``, res)
}

module.exports = {
    navbar
};
