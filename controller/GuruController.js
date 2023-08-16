const db = require('./../Config')
const response = require('./../Response')

const guru = async (req, res) => {
    const guru = await db('guru').select()
    return response(200, guru, `Data Guru`, res)
}

module.exports = { guru }