const response = require('../Response')
const Moment = require('../utilities/Moment');
const SiswaModel = require('../Model/SiswaModel');
const KelasModel = require('../Model/KelasModel');
const GuruModel = require('../Model/GuruModel');
const AbsenSiswaModel = require('../Model/AbsenSiswaModel');
const TransaksiPembayaranSiswaModel = require('../Model/TransaksiPembayaranSiswaModel');

const dataSiswaGuruKelas = async (req, res) => {
    try {
        const siswa = await SiswaModel.getAllIDSiswa()
        const kelas = await KelasModel.getAllKelas()
        const guru = await GuruModel.getAllGuru()

        const data = {
            siswa: siswa.length,
            kelas: kelas.length,
            guru: guru.length
        }

        return response(200, data, `Data Siswa, Guru, dan Kelas`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const diagramAbsenHarianSiswa = async (req, res) => {
    try {
        const diagramHarian = await AbsenSiswaModel.statistikHarian()

        if (!diagramHarian.H && !diagramHarian.S && !diagramHarian.I && !diagramHarian.A && !diagramHarian.T) {
            return response(200, [0, 0, 0, 0, 0], `Absen Kosong`, res)
        }

        return response(200, [diagramHarian.H, diagramHarian.S, diagramHarian.I, diagramHarian.A, diagramHarian.T], 'Diagram Absen Siswa Hari Ini', res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const grafikAbsenMingguanSiswa = async (req, res) => {
    try {
        const data = await AbsenSiswaModel.statistikMingguan()
        const statistik = data.map(item => {
            return {
                Sakit: item.S,
                Izin: item.I,
                Alfa: item.A,
                Terlambat: item.T,
            }
        })
        let categories = ["Sakit", "Izin", "Alfa", "Terlambat"]
        let series = []
    
        categories.forEach(category => {
            let data = {
                "name": category,
                "data": []
            }
    
            statistik.forEach(stats => {
                data.data.push(stats[category])
            })
    
            series.push(data)
        })
    
        const tanggal = data.map(item => Moment(item.tanggal).format('Do MMM YY'))
    
        series.reverse()
        tanggal.reverse()
    
        return response(200, { series, labels: tanggal }, `Grafik Absen Siswa Mingguan`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const grafikKeuangan = async (req, res) => {
    try {
        const range = req.query.range
        if (!range || range === 'undefined') return response(400, null, `Masukkan Range Tanggal!`, res)

        const tanggal = range.split(' to ')
        if (tanggal.length < 2) tanggal.push(tanggal[0])
        const dari = tanggal[0]
        const sampai = tanggal[1]

        const transaksi = await TransaksiPembayaranSiswaModel.getSumTransactionEveryDay(dari, sampai)

        let series = {
            "name": "Pemasukan",
            "data": transaksi[0].map(item => item.total)
        }
        let labels = transaksi[0].map(item => Moment(item.date).format('Do MMM YYYY'))

        return response(200, { series, labels  }, `Data Total Transaksi Setiap Hari dari ${range}`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

module.exports = {
    dataSiswaGuruKelas,
    diagramAbsenHarianSiswa,
    grafikAbsenMingguanSiswa,
    grafikKeuangan
};
