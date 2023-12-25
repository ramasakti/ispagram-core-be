const db = require('../Config')

const existingHari = async (nama_hari) => {
    const existingHari = await db('hari').where('nama_hari', nama_hari).first()
    if (!existingHari) return null
    return existingHari
}

module.exports = { existingHari }