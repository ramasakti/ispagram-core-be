const getAllTransactionByDateRange = async (dari, sampai, trx) => {
    return await trx('transaksi')
        .select(
            'transaksi.kwitansi',
            trx.raw('MAX(detail_siswa.nama_siswa) as nama_siswa'),
            'transaksi.waktu_transaksi',
            trx.raw('SUM(transaksi.terbayar) as terbayar')
        )
        .innerJoin('detail_siswa', 'detail_siswa.id_siswa', 'transaksi.siswa_id')
        .whereBetween('transaksi.waktu_transaksi', [`${dari} 00:00:00`, `${sampai} 23:59:59`])
        .groupBy('transaksi.kwitansi', 'transaksi.waktu_transaksi')
        .orderBy('transaksi.waktu_transaksi', 'desc')
}

const getDetailTransactionByID = async (kwitansi, trx) => {
    return await trx('transaksi')
        .select('nama_pembayaran', 'nominal', 'terbayar')
        .join('pembayaran', 'pembayaran.id_pembayaran', '=', 'transaksi.pembayaran_id')
        .where('transaksi.kwitansi', kwitansi)
}

const getTransactionBySiswa = async (id_siswa, trx) => {
    return await trx('transaksi')
        .select(
            'transaksi.kwitansi',
            trx.raw('MAX(detail_siswa.nama_siswa) as nama_siswa'),
            'transaksi.waktu_transaksi',
            trx.raw('SUM(transaksi.terbayar) as terbayar')
        )
        .innerJoin('siswa', 'siswa.id_siswa', 'transaksi.siswa_id')
        .where('transaksi.siswa_id', id_siswa)
        .groupBy('transaksi.kwitansi', 'transaksi.waktu_transaksi')
        .orderBy('transaksi.waktu_transaksi', 'desc')
}

const getTransactionByPembayaranAndIDSiswa = async (array_pembayaran, id_siswa, trx) => {
    return await trx('transaksi')
        .select(
            'pembayaran_id',
            trx.raw('IFNULL(SUM(transaksi.terbayar), 0) AS terbayar')
        )
        .join('detail_siswa', 'detail_siswa.id_siswa', '=', 'transaksi.siswa_id')
        .whereIn('transaksi.pembayaran_id', array_pembayaran)
        .where('transaksi.siswa_id', id_siswa)
        .groupBy('transaksi.pembayaran_id')
}

const getTransactionByPembayaran = async (id_pembayaran, trx) => {
    return await trx('transaksi').where('transaksi.pembayaran_id', id_pembayaran)
}

const updateTunggakanBySiswa = async (req, trx) => {
    return await trx('tunggakan').insert(req)
}

const getSumTransactionEveryDay = async (dari, sampai, trx) => {
    return await trx.raw(`
        WITH RECURSIVE dates AS (
            SELECT DATE(?) AS date
            UNION ALL
            SELECT date + INTERVAL 1 DAY
            FROM dates
            WHERE date + INTERVAL 1 DAY <= DATE(?)
        )
        SELECT dates.date, IFNULL(SUM(transaksi.terbayar), 0) AS total
        FROM dates
        LEFT JOIN transaksi ON dates.date = DATE(transaksi.waktu_transaksi)
        GROUP BY dates.date
        ORDER BY dates.date
        `, [dari, sampai]);
}

const createTransaction = async (req, trx) => await trx('transaksi').insert(req)

module.exports = {
    getAllTransactionByDateRange,
    getDetailTransactionByID,
    getTransactionBySiswa,
    getTransactionByPembayaranAndIDSiswa,
    getTransactionByPembayaran,
    updateTunggakanBySiswa,
    getSumTransactionEveryDay,
    createTransaction
};
