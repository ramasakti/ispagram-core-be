const db = require('../Config')
const response = require('../Response')
const moment = require('../utilities/Moment')
const AbsenSiswaModel = require('../Model/AbsenSiswaModel')

const dataAllAbsensiSiswa = async (req, res) => {
    try {
        const dataAllAbsensiSiswa = await AbsenSiswaModel.dataAllAbsensiSiswa(req.db)
        return response(200, dataAllAbsensiSiswa, 'Data presensi', res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const dataAbsensi = async (req, res) => {
    try {
        const dataKetidakhadiran = await AbsenSiswaModel.dataAllKetidakhadiranSiswa(req.db)
        return response(200, dataKetidakhadiran, 'Data absenssi', res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const dataAbsensiKelas = async (req, res) => {
    try {
        const kelas_id = req.params.kelas_id
        const dataKetidakhadiran = await AbsenSiswaModel.dataKetidakhadiranKelas(kelas_id, req.db)
        return response(200, dataKetidakhadiran, 'Data absensi', res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const dataTerlambat = async (req, res) => {
    try {
        const dataTerlambat = await AbsenSiswaModel.getAllSiswaTerlambat(req.db)
        return response(200, dataTerlambat, 'Data Siswa Terlambat', res)
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
        const dataAbsen = await AbsenSiswaModel.dataAbsensiSiswaIndividu(id_siswa, req.db)
        if (!dataAbsen) return response(404, null, `ID Anda tidak terdaftar!`, res)

        // Jika keterangan hadir
        if (keterangan === 'H') { 
            await AbsenSiswaModel.updateHadir(id_siswa, req.db)
            return response(201, dataAbsen, `Berhasil absen!`, res)
        }else{
            await AbsenSiswaModel.updateAbsenOrTerlambat(id_siswa, keterangan, req.db)
            return response(201, dataAbsen, `Berhasil absen!`, res)
        }
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
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
    
        const rekap = await AbsenSiswaModel.rekap(kelas, dari, sampai, req.db)
    
        return response(200, rekap, `Rekap Absen Siswa dari ${dari} sampai ${sampai}`, res);
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const dataWA = async (req, res) => {
    try {
        const id_siswa = req.params.id_siswa
        const detail = await AbsenSiswaModel.whatsapp(id_siswa, req.db)

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

        const dataAbsen = await AbsenSiswaModel.rekapIndividu(id_siswa, req.db)
            
        return response(200, dataAbsen, `Data Rekap Absensi ${id_siswa}`, res)
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal Server Error!`, res)
    }
}

const resetAbsenHarian = async (req, res) => {
    try {
        await AbsenSiswaModel.updateAbsenToDefault(req.db)
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
    dataTerlambat,
    update,
    rekap,
    dataWA,
    diagramIndividu,
    resetAbsenHarian
} 