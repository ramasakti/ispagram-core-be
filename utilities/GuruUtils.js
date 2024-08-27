const moment = require('./Moment')
const GuruModel = require('../Model/GuruModel')

const existingGuru = async (id_guru, trx) => {
    const existingGuru = await GuruModel.getGuruByID(id_guru, trx)
    if (!existingGuru) return null
    return existingGuru
}

module.exports = { existingGuru }