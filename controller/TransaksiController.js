const db = require('../Config')
const response = require('../Response')
const moment = require('../Utilities/Moment')
moment().format('YYYY-MM-DD')

const dataTransaksi = async (req, res) => {
    try {
        // Tangkap request parameter
        const dari = req.query.dari
        const sampai = req.query.sampai

        if (!dari || !sampai) return response(400, null, `Semua form wajib diisi!`, res)

        // Query ke database
        const transaksi = await db.select('transaksi.kwitansi', db.raw('MAX(siswa.nama_siswa) as nama_siswa'), 'transaksi.waktu_transaksi', db.raw('SUM(transaksi.terbayar) as terbayar'))
            .from('transaksi')
            .innerJoin('siswa', 'siswa.id_siswa', 'transaksi.siswa_id')
            .whereBetween('transaksi.waktu_transaksi', [`${dari} 00:00:00`, `${sampai} 23:59:59`])
            .groupBy('transaksi.kwitansi', 'transaksi.waktu_transaksi')
            .orderBy('transaksi.waktu_transaksi', 'desc')

        // Destruktur sebelum mereturn
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

const detailTagihanKelas = async (req, res) => {
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

const detailTagihanSiswa = async (req, res) => {
    try {
        // Tangkap dan periksa inputan
        const { siswa, selectedPayments } = req.body
        if (!siswa || !selectedPayments) return response(400, null, `Semua field wajib diisi!`, res)

        const detailTagihanSiswa = await db('pembayaran')
            .select(
                'id_pembayaran',
                'nama_pembayaran',
                'nominal',
            )
            .whereIn('pembayaran.id_pembayaran', selectedPayments)

        const trx = await db('transaksi')
            .select(
                'pembayaran_id',
                db.raw('IFNULL(SUM(transaksi.terbayar), 0) AS terbayar')
            )
            .join('siswa', 'siswa.id_siswa', '=', 'transaksi.siswa_id')
            .whereIn('transaksi.pembayaran_id', selectedPayments)
            .where('transaksi.siswa_id', siswa)
            .groupBy('transaksi.pembayaran_id')

        const mergedArray = detailTagihanSiswa.map(detail => ({
            ...detail,
            ...trx.find(trx => trx.pembayaran_id === detail.id_pembayaran)
        }))

        mergedArray.map(item => delete item.pembayaran_id)

        return response(200, mergedArray, ``, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error`, res)
    }
}

const transaksiSiswa = async (req, res) => {
    try {
        const id_siswa = req.params.id_siswa

        const transaksi = await db.select('transaksi.kwitansi', db.raw('MAX(siswa.nama_siswa) as nama_siswa'), 'transaksi.waktu_transaksi', db.raw('SUM(transaksi.terbayar) as terbayar'))
            .from('transaksi')
            .innerJoin('siswa', 'siswa.id_siswa', 'transaksi.siswa_id')
            .where('transaksi.siswa_id', id_siswa)
            .groupBy('transaksi.kwitansi', 'transaksi.waktu_transaksi')
            .orderBy('transaksi.waktu_transaksi', 'desc')

        const dataTransaksi = transaksi.map(item => {
            return {
                kwitansi: item.kwitansi,
                nama_siswa: item.nama_siswa,
                waktu_transaksi: moment(item.waktu_transaksi).format('YYYY-MM-DD HH:mm:ss'),
                terbayar: item.terbayar
            }
        })

        return response(200, dataTransaksi, `Data Riwayat Transaksi ${id_siswa}`, res)
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal Server Error!`, res)
    }
}

const transaksi = async (req, res) => {
    try {
        const { siswa, dataPembayaranSiswa } = req.body

        if (!siswa || !dataPembayaranSiswa) return response(400, null, `Semua field wajib diisi!`, res)

        const selectedPayments = dataPembayaranSiswa.map(item => item.id_pembayaran.toString())

        dataPembayaranSiswa.map(item => {
            delete item.kekurangan
            delete item.cssClass
        })

        const trx = await db('transaksi')
            .select(
                'pembayaran_id',
                db.raw('IFNULL(SUM(transaksi.terbayar), 0) AS terbayar')
            )
            .join('siswa', 'siswa.id_siswa', '=', 'transaksi.siswa_id')
            .whereIn('transaksi.pembayaran_id', selectedPayments)
            .where('transaksi.siswa_id', siswa)
            .groupBy('transaksi.pembayaran_id')

        const mergedArray = dataPembayaranSiswa.map(detail => ({
            ...detail,
            ...trx.find(trx => trx.pembayaran_id === detail.id_pembayaran)
        }))

        let errorMessage = null

        mergedArray.forEach(item => {
            delete item.pembayaran_id

            if (item.terbayar) {
                const kekurangan = item.nominal - item.terbayar
                if (kekurangan === 0) {
                    errorMessage = `Pembayaran ${item.nama_pembayaran} telah lunas!`
                } else if (kekurangan < item.membayar) {
                    errorMessage = `Jumlah yang dibayarkan ${item.membayar} melebihi jumlah kekurangan ${kekurangan} yang harus dibayarkan pada pembayaran ${item.nama_pembayaran}`
                }
            } else {
                if (item.nominal < item.membayar) {
                    errorMessage = `Jumlah yang dibayarkan ${item.membayar} melebihi jumlah nominal yang harus dibayarkan (${item.nominal}) pada pembayaran ${item.nama_pembayaran}`
                }
            }
        })

        if (errorMessage) {
            return response(400, null, errorMessage, res)
        } else {
            dataPembayaranSiswa.map(async item => {
                await db('transaksi').insert({
                    kwitansi: `K${moment().format('YYYYMMDDhhmmssms')}`,
                    waktu_transaksi: moment().format('YYYY-MM-DD hh:mm:ss'),
                    siswa_id: siswa,
                    pembayaran_id: item.id_pembayaran,
                    terbayar: item.membayar
                })
            })

            return response(201, {}, `Berhasil melakukan pembayaran!`, res)
        }
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const detailTransaksi = async (req, res) => {
    const kwitansi = req.params.kwitansi
    const detailTransaksi = await db('transaksi')
        .select('nama_pembayaran', 'nominal', 'terbayar')
        .join('pembayaran', 'pembayaran.id_pembayaran', '=', 'transaksi.pembayaran_id')
        .where('transaksi.kwitansi', kwitansi)
    return response(200, detailTransaksi, `Detail Transaksi`, res)
}


module.exports = { dataTransaksi, transaksi, detailTransaksi, detailTagihanKelas, detailTagihanSiswa, transaksiSiswa }