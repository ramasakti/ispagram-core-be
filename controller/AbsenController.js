const db = require('../Config')
const response = require('../Response')
const moment = require('../utilities/Moment')
const absenSiswaUtils = require('../utilities/AbsenSiswaUtils')
const AbsenSiswaModel = require('../Model/AbsenSiswaModel')

const dataAllAbsensiSiswa = async (req, res) => {
    try {
        const dataAllAbsensiSiswa = await AbsenSiswaModel.dataAllAbsensiSiswa()
        return response(200, dataAllAbsensiSiswa, 'Data presensi', res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const dataAbsensi = async (req, res) => {
    try {
        const dataKetidakhadiran = await AbsenSiswaModel.dataAllKetidakhadiranSiswa()
        return response(200, dataKetidakhadiran, 'Data absenssi', res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const dataAbsensiKelas = async (req, res) => {
    try {
        const kelas_id = req.params.kelas_id
        const dataKetidakhadiran = await AbsenSiswaModel.dataKetidakhadiranKelas(kelas_id)
        return response(200, dataKetidakhadiran, 'Data absensi', res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const update = async (req, res) => {
    try {
        const id_siswa = req.params.id_siswa
        const { keterangan } = req.body

        if (!keterangan) return response(404, null, `Keterangan wajib diisi!`, res)
        
        // Cek absen individu
        const dataAbsen = await AbsenSiswaModel.dataAbsensiSiswaIndividu(id_siswa)
        if (!dataAbsen) return response(404, null, `ID Anda tidak terdaftar!`, res)

        // Jika keterangan hadir
        if (keterangan === 'H') { 
            await AbsenSiswaModel.updateHadir(id_siswa)
            return response(201, dataAbsen, `Berhasil absen!`, res)
        }else{
            await AbsenSiswaModel.updateAbsenOrTerlambat(id_siswa, keterangan)
            return response(201, dataAbsen, `Berhasil absen!`, res)
        }
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const diagramHarian = async (req, res) => {
    try {
        const diagramHarian = await AbsenSiswaModel.statistikHarian()

        if (!diagramHarian.H && !diagramHarian.S && !diagramHarian.I && !diagramHarian.A && !diagramHarian.T) {
            return response(200, [0, 0, 0, 0, 0], `Absen Kosong`, res)
        }

        return response(200, [diagramHarian.H, diagramHarian.S, diagramHarian.I, diagramHarian.A, diagramHarian.T], 'Diagram Hari Ini!', res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const grafikMingguan = async (req, res) => {
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

    const tanggal = data.map(item => moment(item.tanggal).format('Do MMM YY'))

    series.reverse()
    tanggal.reverse()

    return response(200, { series, labels: tanggal }, `Grafik`, res)
}

const rekap = async (req, res) => {
    try {
        const { kelas, range } = req.query;
    
        if (!kelas || !range || range === 'undefined') return response(400, null, 'Form tidak lengkap!', res)
    
        // Memisahkan tanggal awal dan tanggal akhir dari range
        const tanggalArray = range.split(' to ')
        if (tanggalArray.length < 2) tanggalArray.push(tanggalArray[0])
    
        const dari = tanggalArray[0]
        const sampai = tanggalArray[1]
    
        const rekap = await AbsenSiswaModel.rekap(kelas, dari, sampai)
    
        return response(200, rekap, `Rekap Absen Siswa dari ${dari} sampai ${sampai}`, res);
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const dataWA = async (req, res) => {
    try {
        const id_siswa = req.params.id_siswa
        const detail = await AbsenSiswaModel.whatsapp(id_siswa)

        return response(200, detail, ``, res)
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal Server Error!`, res)
    }
}

const diagramIndividu = async (req, res) => {
    try {
        const id_siswa = req.params.id_siswa
        if (!id_siswa) return response(400, null, `ID Tidak Terdaftar!`, res)

        const dataAbsen = await AbsenSiswaModel.rekapIndividu(id_siswa)
            
        return response(200, dataAbsen, `Data Rekap Absensi ${id_siswa}`, res)
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal Server Error!`, res)
    }
}

const resetAbsenHarian = async (req, res) => {
    try {
        await AbsenSiswaModel.updateAbsenToDefault()
        return response(200, {}, `Berhasil Reset Absen!`, res)
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal Server Error!`, res)
    }
}

module.exports = {
    dataAllAbsensiSiswa,
    dataAbsensi,
    dataAbsensiKelas,
    update,
    diagramHarian,
    grafikMingguan,
    rekap,
    dataWA,
    diagramIndividu,
    resetAbsenHarian
} 