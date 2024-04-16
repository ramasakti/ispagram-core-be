const db = require('../Config')

const getAllTransactionByDateRange = async (dari, sampai, trx = db) => {
    return await trx('transaksi')
        .select(
            'transaksi.kwitansi',
            db.raw('MAX(detail_siswa.nama_siswa) as nama_siswa'),
            'transaksi.waktu_transaksi',
            db.raw('SUM(transaksi.terbayar) as terbayar')
        )
        .innerJoin('detail_siswa', 'detail_siswa.id_siswa', 'transaksi.siswa_id')
        .whereBetween('transaksi.waktu_transaksi', [`${dari} 00:00:00`, `${sampai} 23:59:59`])
        .groupBy('transaksi.kwitansi', 'transaksi.waktu_transaksi')
        .orderBy('transaksi.waktu_transaksi', 'desc')
}

const getDetailTransactionByID = async (kwitansi, trx = db) => {
    return await trx('transaksi')
        .select('nama_pembayaran', 'nominal', 'terbayar')
        .join('pembayaran', 'pembayaran.id_pembayaran', '=', 'transaksi.pembayaran_id')
        .where('transaksi.kwitansi', kwitansi)
}

const getTransactionBySiswa = async (id_siswa, trx = db) => {
    return await trx('transaksi')
        .select(
            'transaksi.kwitansi',
            db.raw('MAX(detail_siswa.nama_siswa) as nama_siswa'),
            'transaksi.waktu_transaksi',
            db.raw('SUM(transaksi.terbayar) as terbayar')
        )
        .innerJoin('siswa', 'siswa.id_siswa', 'transaksi.siswa_id')
        .where('transaksi.siswa_id', id_siswa)
        .groupBy('transaksi.kwitansi', 'transaksi.waktu_transaksi')
        .orderBy('transaksi.waktu_transaksi', 'desc')
}

const getTransactionByPembayaranAndIDSiswa = async (array_pembayaran, id_siswa, trx = db) => {
    return await trx('transaksi')
        .select(
            'pembayaran_id',
            db.raw('IFNULL(SUM(transaksi.terbayar), 0) AS terbayar')
        )
        .join('siswa', 'siswa.id_siswa', '=', 'transaksi.siswa_id')
        .whereIn('transaksi.pembayaran_id', array_pembayaran)
        .where('transaksi.siswa_id', id_siswa)
        .groupBy('transaksi.pembayaran_id')
}

const getTransactionByPembayaran = async (id_pembayaran, trx = db) => {
    return await trx('transaksi').where('transaksi.pembayaran_id', id_pembayaran)
}

const updateTunggakanBySiswa = async (req, trx = db) => {
    return await trx('tunggakan').insert(req)
}

module.exports = {
    getAllTransactionByDateRange,
    getDetailTransactionByID,
    getTransactionBySiswa,
    getTransactionByPembayaranAndIDSiswa,
    getTransactionByPembayaran,
    updateTunggakanBySiswa
};
