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
        const transaksi = await TransaksiPembayaranSiswaModel.getAllTransactionByDateRange(dari, sampai)

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

        let tagihan = []
        const siswa = await SiswaModel.getSiswaByID(id_siswa)
        const tunggakan = await PembayaranSiswaModel.getTagihanTunggakanBySiswa(id_siswa)

        if (siswa) var kelas = siswa.kelas_id.toString()

        if (kelas) {
            const dataPembayaran = await PembayaranSiswaModel.getPembayaranActive()
            const pembayaran = dataPembayaran.filter(item => item.kelas.includes(kelas))
            const arrayIDPembayaran = pembayaran.map(item => item.id_pembayaran)
    
            const detailTagihan = await PembayaranSiswaModel.getTransaksiPembayaranBySiswaAndInID(arrayIDPembayaran, id_siswa)
    
            for (var i = 0; i < pembayaran.length; i++) {
                var found = false;
                for (var j = 0; j < detailTagihan.length; j++) {
                    if (pembayaran[i].id_pembayaran === detailTagihan[j].id_pembayaran) {
                        pembayaran[i].terbayar = detailTagihan[j].terbayar;
                        found = true;
                        break;
                    }
                }
                if (!found) pembayaran[i].terbayar = 0;
                delete pembayaran[i].kelas;
                tagihan.push(pembayaran[i]);
            }
        }

        return response(200, { tagihan, tunggakan }, `Tagihan dan tunggakan`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error`, res)
    }
}

const detailTagihanSiswa = async (req, res) => {
    try {
        const { siswa, selectedPayments } = req.body
        if (!siswa || !selectedPayments) return response(400, null, `Semua field wajib diisi!`, res)

        const detailTagihanSiswa = await PembayaranSiswaModel.getPembayaranInID(selectedPayments)

        const trx = await TransaksiPembayaranSiswaModel.getTransactionByPembayaranAndIDSiswa(selectedPayments, siswa)

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
        const transaksi = await TransaksiPembayaranSiswaModel.getTransactionBySiswa(id_siswa)

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

        const trx = await TransaksiPembayaranSiswaModel.getTransactionByPembayaranAndIDSiswa(selectedPayments, siswa)

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

const detail = async (req, res) => {
    try {
        const kwitansi = req.params.kwitansi
        const detail = await TransaksiPembayaranSiswaModel.getDetailTransactionByID(kwitansi)
        return response(200, detail, `Detail Transaksi`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}


module.exports = { dataTransaksi, transaksi, detail, detailTagihanSiswa, transaksiSiswa, tagihan }