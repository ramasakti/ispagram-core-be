const db = require('./../Config')
const response = require('./../Response')
const moment = require('../utilities/moment')
moment().format('YYYY-MM-DD')

const dataTransaksi = async (req, res) => {
    try {
        const tanggal = req.query.tanggal;

        const transaksi = await db.select('kwitansi', 'nama_siswa', 'waktu_transaksi', db.raw('SUM(terbayar) as terbayar'))
            .from('transaksi')
            .innerJoin('siswa', 'siswa.id_siswa', 'transaksi.siswa_id')
            .whereBetween('transaksi.waktu_transaksi', [`${tanggal} 00:00:00`, `${tanggal} 23:59:59`])
            .groupBy('transaksi.kwitansi')
            .orderBy('transaksi.waktu_transaksi', 'desc')
            .orderByRaw('transaksi.waktu_transaksi COLLATE utf8mb4_unicode_ci DESC')

        const dataTransaksi = transaksi.map(item => {
            return {
                kwitansi: item.kwitansi,
                nama_siswa: item.nama_siswa,
                waktu_transaksi: moment(item.waktu_transaksi).format('YYYY-MM-DD HH:mm:ss'),
                terbayar: item.terbayar
            }
        })

        return response(200, dataTransaksi, `Data Transaksi`, res);
    } catch (error) {
        console.error(error);
        return response(500, null, 'Internal Server Error', res);
    }
}

const detailTagihan = async (req, res) => {
    const id_siswa = req.params.id_siswa

    const siswa = await db('siswa').where('id_siswa', id_siswa).first()
    if (!siswa) return response(400, null, `Siswa Tidak Terdaftar`, res)

    const kelas = siswa.kelas_id.toString()

    const dataPembayaran = await db('pembayaran').select()
    const pembayaran = dataPembayaran.filter(item => item.kelas.includes(kelas))
    const idPembayaranArray = pembayaran.map(item => item.id_pembayaran)

    const detailTagihan = await db('transaksi')
        .select(
            'id_pembayaran',
            'nama_pembayaran',
            'nominal',
            db.raw('SUM(terbayar) as terbayar')
        )
        .join('pembayaran', 'pembayaran.id_pembayaran', '=', 'transaksi.pembayaran_id')
        .where('transaksi.siswa_id', siswa.id_siswa)
        .whereIn('pembayaran.id_pembayaran', idPembayaranArray)
        .groupBy('pembayaran.id_pembayaran')

    let z = []
    for (var i = 0; i < pembayaran.length; i++) {
        var found = false;
        for (var j = 0; j < detailTagihan.length; j++) {
            if (pembayaran[i].id_pembayaran === detailTagihan[j].id_pembayaran) {
                pembayaran[i].terbayar = detailTagihan[j].terbayar;
                found = true;
                break;
            }
        }
        if (!found) {
            pembayaran[i].terbayar = 0;
        }
        delete pembayaran[i].kelas;
        z.push(pembayaran[i]);
    }
 
    return response(200, z, `Detail Tagihan`, res)
}

const transaksi = async (req, res) => {

}

const detailTransaksi = async (req, res) => {
    const kwitansi = req.params.kwitansi
    const detailTransaksi = await db('transaksi')
        .select('nama_pembayaran', 'nominal', 'terbayar')
        .join('pembayaran', 'pembayaran.id_pembayaran', '=', 'transaksi.pembayaran_id')
        .where('transaksi.kwitansi', kwitansi)
    return response(200, detailTransaksi, `Detail Transaksi`, res)
}

module.exports = { dataTransaksi, transaksi, detailTransaksi, detailTagihan }