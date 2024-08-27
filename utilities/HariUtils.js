const HariModel = require('../Model/HariModel')

const existingHari = async (nama_hari, trx) => {
    const existingHari = await HariModel.getHariByHari(nama_hari, trx)
    if (!existingHari) return null
    return existingHari
}

module.exports = { existingHari }