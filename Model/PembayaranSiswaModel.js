const getAllPembayaran = async (trx) => await trx('pembayaran')

const getPembayaranActive = async (trx) => await trx('pembayaran').where('active', true)

const getPembayaranByKelas = async (kelas_id, trx) => await trx('pembayaran').where('kelas_id', kelas_id)

const getPembayaranByID = async (id_pembayaran, trx) => await trx('pembayaran').where('id_pembayaran', id_pembayaran).first()

const getPembayaranInID = async (array_id, trx) => {
    return await trx('pembayaran')
        .select('id_pembayaran', 'nama_pembayaran', 'nominal')
        .whereIn('pembayaran.id_pembayaran', array_id)
}

const getTransaksiPembayaranBySiswaAndInID = async (array_pembayaran, siswa, trx) => {
    return await trx('transaksi')
        .select(
            'id_pembayaran',
            'nama_pembayaran',
            'nominal',
            trx.raw('SUM(terbayar) as terbayar')
        )
        .join('pembayaran', 'pembayaran.id_pembayaran', '=', 'transaksi.pembayaran_id')
        .where('transaksi.siswa_id', siswa)
        .where('pembayaran.active', 1)
        .whereIn('pembayaran.id_pembayaran', array_pembayaran)
        .groupBy('pembayaran.id_pembayaran')
}

const insertPembayaran = async (req, trx) => await trx('pembayaran').insert(req)

const updatePembayaran = async (id_pembayaran, req, trx) => await trx('pembayaran').where('id_pembayaran', id_pembayaran).update(req)

const deletePembayaran = async (id_pembayaran, trx) => await trx('pembayaran').where('id_pembayaran', id_pembayaran).del()

const getTagihanSiswa = async (id_siswa, id_pembayaran, trx) => {
    return await trx('transaksi')
        .select(
            'id_pembayaran',
            'nama_pembayaran',
            'nominal',
            trx.raw('SUM(terbayar) as terbayar')
        )
        .join('pembayaran', 'pembayaran.id_pembayaran', '=', 'transaksi.pembayaran_id')
        .where('transaksi.siswa_id', id_siswa)
        .whereIn('pembayaran.id_pembayaran', id_pembayaran)
        .groupBy('pembayaran.id_pembayaran')
}

const updateStatusPembayaran = async (status, trx) => await trx('pembayaran').update({ active: status })

const getTagihanPembayaranByIDSiswa = async (id_siswa, trx) => {
    return await trx('detail_siswa')
        .select(
            'detail_siswa.nama_siswa',
            'pembayaran.id_pembayaran',
            'pembayaran.nama_pembayaran',
            'pembayaran.nominal',
            trx.raw('COALESCE(SUM(transaksi.terbayar), 0) as terbayar'),
            trx.raw('COALESCE(pembayaran.nominal - COALESCE(SUM(transaksi.terbayar), 0), pembayaran.nominal) as sisa')
        )
        .leftJoin('siswa', 'siswa.id_siswa', '=', 'detail_siswa.id_siswa')
        .leftJoin('alumni', 'alumni.nis', '=', 'detail_siswa.id_siswa')
        .join('kelas_pembayaran', function () {
            this.on('kelas_pembayaran.kelas_id', '=', 'siswa.kelas_id')
                .orOn('kelas_pembayaran.kelas_id', '=', 'alumni.kelas_id');
        })
        .join('pembayaran', 'pembayaran.id_pembayaran', '=', 'kelas_pembayaran.pembayaran_id')
        .leftJoin('transaksi', function () {
            this.on('transaksi.pembayaran_id', '=', 'kelas_pembayaran.pembayaran_id')
                .andOn('transaksi.siswa_id', '=', 'detail_siswa.id_siswa');
        })
        .where('detail_siswa.id_siswa', id_siswa)
        .groupBy('pembayaran.id_pembayaran', 'pembayaran.nominal');
}

const getTagihanPembayaranWithTransactionInPembayaranIDBySiswaID = async (array_pembayaran, id_siswa, trx) => {
    return await trx('detail_siswa')
        .select(
            'detail_siswa.nama_siswa',
            'pembayaran.id_pembayaran',
            'pembayaran.nama_pembayaran',
            'pembayaran.nominal',
            trx.raw('CAST(COALESCE(SUM(transaksi.terbayar), 0) AS SIGNED) as terbayar'),
            trx.raw('CAST(COALESCE(pembayaran.nominal - COALESCE(SUM(transaksi.terbayar), 0), pembayaran.nominal) AS SIGNED) as kekurangan')
        )
        .leftJoin('siswa', 'siswa.id_siswa', '=', 'detail_siswa.id_siswa')
        .leftJoin('alumni', 'alumni.nis', '=', 'detail_siswa.id_siswa')
        .join('kelas_pembayaran', function () {
            this.on('kelas_pembayaran.kelas_id', '=', 'siswa.kelas_id')
                .orOn('kelas_pembayaran.kelas_id', '=', 'alumni.kelas_id');
        })
        .join('pembayaran', 'pembayaran.id_pembayaran', '=', 'kelas_pembayaran.pembayaran_id')
        .leftJoin('transaksi', function () {
            this.on('transaksi.pembayaran_id', '=', 'kelas_pembayaran.pembayaran_id')
                .andOn('transaksi.siswa_id', '=', 'detail_siswa.id_siswa');
        })
        .whereIn('pembayaran.id_pembayaran', array_pembayaran)
        .where('detail_siswa.id_siswa', id_siswa)
        .groupBy('pembayaran.id_pembayaran', 'pembayaran.nominal');
}

const getTagihanTunggakanBySiswa = async (id_siswa, trx) => {
    return await trx('tunggakan')
        .select(
            'pembayaran.id_pembayaran',
            'pembayaran.nama_pembayaran',
            'pembayaran.nominal',
            'pembayaran.active',
            trx.raw('SUM(terbayar) as terbayar')
        )
        .join('pembayaran', 'pembayaran.id_pembayaran', '=', 'tunggakan.pembayaran_id')
        .leftJoin('transaksi', function () {
            this.on('transaksi.pembayaran_id', '=', 'pembayaran.id_pembayaran')
                .andOn('transaksi.siswa_id', '=', trx.raw('?', [id_siswa]))
        })
        .where('tunggakan.id_siswa', id_siswa)
        .groupBy('detail_siswa.id_siswa')

}

const getTunggakanAlumni = async (trx) => {
    return trx('alumni')
        .join('detail_siswa', 'alumni.nis', 'detail_siswa.id_siswa')
        .leftJoin('tunggakan', 'detail_siswa.id_siswa', 'tunggakan.id_siswa')
        .leftJoin('pembayaran', 'tunggakan.pembayaran_id', 'pembayaran.id_pembayaran')
        .leftJoin('transaksi', function () {
            this.on('tunggakan.id_siswa', '=', 'transaksi.siswa_id')
                .andOn('tunggakan.pembayaran_id', '=', 'transaksi.pembayaran_id');
        })
        .select(
            'alumni.nis',
            'detail_siswa.nama_siswa',
            'detail_siswa.nisn',
            'alumni.tahun_lulus',
            trx.raw('SUM(pembayaran.nominal - IFNULL(transaksi.terbayar, 0)) as total_tunggakan')
        )
        .groupBy('alumni.nis', 'detail_siswa.nama_siswa', 'detail_siswa.nisn');
}

const insertKelasPembayaran = async (req, trx) => await trx('kelas_pembayaran').insert(req)

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
    getTagihanTunggakanBySiswa,
    getTunggakanAlumni,
    insertKelasPembayaran,
    getTagihanPembayaranByIDSiswa,
    getTagihanPembayaranWithTransactionInPembayaranIDBySiswaID
};
