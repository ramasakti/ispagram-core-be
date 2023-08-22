const db = require('../Config')
const moment = require('./moment')

const existingGuru = async (id_guru) => {
    const existingGuru = await db('guru').where('id_guru', id_guru).first()
    if (!existingGuru) return null
    return existingGuru
}

module.exports = { existingGuru }