const db = require('../Config')

const getAllPembayaran = async (trx = db) => await trx('pembayaran')

const getPembayaranActive = async (trx = db) => await trx('pembayaran').where('active', true)

const getPembayaranByKelas = async (kelas_id, trx = db) => await trx('pembayaran').where('kelas_id', kelas_id)

const getPembayaranByID = async (id_pembayaran, trx = db) => await trx('pembayaran').where('id_pembayaran', id_pembayaran).first()

const getPembayaranInID = async (array_id, trx = db) => {
    return await trx('pembayaran')
        .select('id_pembayaran', 'nama_pembayaran', 'nominal')
        .whereIn('pembayaran.id_pembayaran', array_id)
}

const getTransaksiPembayaranBySiswaAndInID = async (array_pembayaran, siswa, trx = db) => {
    return await trx('transaksi')
        .select(
            'id_pembayaran',
            'nama_pembayaran',
            'nominal',
            db.raw('SUM(terbayar) as terbayar')
        )
        .join('pembayaran', 'pembayaran.id_pembayaran', '=', 'transaksi.pembayaran_id')
        .where('transaksi.siswa_id', siswa)
        .where('pembayaran.active', 1)
        .whereIn('pembayaran.id_pembayaran', array_pembayaran)
        .groupBy('pembayaran.id_pembayaran')
}

const insertPembayaran = async (req, trx = db) => await trx('pembayaran').insert(req)

const updatePembayaran = async (id_pembayaran, req, trx = db) => await trx('pembayaran').where('id_pembayaran', id_pembayaran).update(req)

const deletePembayaran = async (id_pembayaran, trx = db) => await trx('pembayaran').where('id_pembayaran', id_pembayaran).del()

const getTagihanSiswa = async (id_siswa, id_pembayaran, trx = db) => {
    return await trx('transaksi')
        .select(
            'id_pembayaran',
            'nama_pembayaran',
            'nominal',
            db.raw('SUM(terbayar) as terbayar')
        )
        .join('pembayaran', 'pembayaran.id_pembayaran', '=', 'transaksi.pembayaran_id')
        .where('transaksi.siswa_id', id_siswa)
        .whereIn('pembayaran.id_pembayaran', id_pembayaran)
        .groupBy('pembayaran.id_pembayaran')
}

const updateStatusPembayaran = async (status, trx = db) => await trx('pembayaran').update({ active: status })

const getTagihanPembayaranBySiswa = async (id_siswa, trx = db) => {
    return await trx('pembayaran')
        .join('transaksi', 'transaksi.pembayaran_id', 'pembayaran.id_pembayaran')
        .where('transaksi.siswa_id', id_siswa)
        .select('pembayaran.*', 'transaksi.terbayar', 'transaksi.kwitansi', 'transaksi.waktu_transaksi');
}

const getTagihanTunggakanBySiswa = async (id_siswa, trx = db) => {
    return await trx('tunggakan')
        .select(
            'pembayaran.id_pembayaran',
            'pembayaran.nama_pembayaran',
            'pembayaran.nominal',
            'pembayaran.active',
            db.raw('SUM(terbayar) as terbayar')
        )
        .join('pembayaran', 'pembayaran.id_pembayaran', '=', 'tunggakan.pembayaran_id')
        .leftJoin('transaksi', function () {
            this.on('transaksi.pembayaran_id', '=', 'pembayaran.id_pembayaran')
                .andOn('transaksi.siswa_id', '=', trx.raw('?', [id_siswa]))
        })
        .where('tunggakan.id_siswa', id_siswa)
        .groupBy('pembayaran.id_pembayaran')

}

module.exports = {
    getAllPembayaran,
    getPembayaranActive,
    getPembayaranByKelas,
    getPembayaranByID,
    getPembayaranInID,
    getTransaksiPembayaranBySiswaAndInID,
    insertPembayaran,
    updatePembayaran,
    deletePembayaran,
    getTagihanSiswa,
    updateStatusPembayaran,
    getTagihanTunggakanBySiswa
};
