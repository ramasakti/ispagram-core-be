const db = require('../Config')

const getAllPembayaran = async () => await db('pembayaran')

const getPembayaranByKelas = async (kelas_id) => {
    return await db('pembayaran').where('kelas_id', kelas_id)
}

const insertPembayaran = async (req) => {
    return await db('pembayaran').insert(req)
}

module.exports = {
    getAllPembayaran,
    getPembayaranByKelas,
    insertPembayaran
};
