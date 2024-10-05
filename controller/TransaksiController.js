const db = require('../Config')
const response = require('../Response')
const moment = require('../utilities/Moment')
const PembayaranSiswaModel = require('../Model/PembayaranSiswaModel')
const TransaksiPembayaranSiswaModel = require('../Model/TransaksiPembayaranSiswaModel')
const SiswaModel = require('../Model/SiswaModel')
moment().format('YYYY-MM-DD')

const dataTransaksi = async (req, res) => {
    try {
        // Tangkap request parameter
        const dari = req.query.dari
        const sampai = req.query.sampai

        if (!dari || !sampai) return response(400, null, `Semua form wajib diisi!`, res)

        // Query ke database
        const transaksi = await TransaksiPembayaranSiswaModel.getAllTransactionByDateRange(dari, sampai, req.db)

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

const tagihan = async (req, res) => {
    try {
        const id_siswa = req.params.id_siswa
        const tagihan = await PembayaranSiswaModel.getTagihanPembayaranByIDSiswa(id_siswa, req.db)

        return response(200, tagihan, `Tagihan Pembayaran`, res)
    } catch (error) {
        console.error(error);
        return response(500, null, 'Internal Server Error', res);
    }
}

const detailTagihan = async (req, res) => {
    try {
        const { siswa, payments } = req.body
        if (!siswa || !payments) return response(400, null, `Semua field wajib diisi!`, res)

        const detailTagihanSiswa = await PembayaranSiswaModel.getPembayaranInID(payments, req.db)

        const trx = await TransaksiPembayaranSiswaModel.getTransactionByPembayaranAndIDSiswa(payments, siswa, req.db)

        const tagihan = detailTagihanSiswa.map(detail => ({
            ...detail,
            ...trx.find(trx => trx.pembayaran_id === detail.id_pembayaran)
        }))

        tagihan.map(item => delete item.pembayaran_id)

        return response(200, tagihan, ``, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error`, res)
    }
}

const transaksiSiswa = async (req, res) => {
    try {
        const id_siswa = req.params.id_siswa
        const transaksi = await TransaksiPembayaranSiswaModel.getTransactionBySiswa(id_siswa, req.db)

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
    const trx = req.db.transaction()
    try {
        const { siswa, payments } = req.body

        if (!siswa || !payments) return response(400, null, `Semua field wajib diisi!`, res)

        payments.map(item => {
            delete item.kekurangan
            delete item.cssClass
        })

        const array_pembayaran = payments.map(item => item.id_pembayaran)

        const trx = await PembayaranSiswaModel.getTagihanPembayaranWithTransactionInPembayaranIDBySiswaID(array_pembayaran, siswa, trx)

        let err = null

        trx.forEach(item => {
            if (item.terbayar) {
                if (item.kekurangan === 0) {
                    err = `Pembayaran ${item.nama_pembayaran} telah lunas!`
                } else if (item.kekurangan < item.membayar) {
                    err = `Jumlah yang dibayarkan ${item.membayar} melebihi jumlah kekurangan ${kekurangan} yang harus dibayarkan pada pembayaran ${item.nama_pembayaran}`
                }
            } else {
                if (item.nominal < item.membayar) {
                    err = `Jumlah yang dibayarkan ${item.membayar} melebihi jumlah nominal yang harus dibayarkan (${item.nominal}) pada pembayaran ${item.nama_pembayaran}`
                }
            }
        })

        if (err) return response(400, null, err, res)

        trx.forEach(async item => {
            await TransaksiPembayaranSiswaModel.createTransaction({
                kwitansi: `K${moment().format('YYYYMMDDhhmmssms')}`,
                waktu_transaksi: moment().format('YYYY-MM-DD hh:mm:ss'),
                siswa_id: siswa,
                pembayaran_id: item.id_pembayaran,
                terbayar: item.membayar
            }, trx)
        })

        trx.commit()
        return response(201, {}, `Berhasil melakukan pembayaran!`, res)
    } catch (error) {
        trx.rollback()
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const detail = async (req, res) => {
    try {
        const kwitansi = req.params.kwitansi
        const detail = await TransaksiPembayaranSiswaModel.getDetailTransactionByID(kwitansi, req.db)
        return response(200, detail, `Detail Transaksi`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}


module.exports = { dataTransaksi, transaksi, detail, detailTagihan, transaksiSiswa, tagihan }