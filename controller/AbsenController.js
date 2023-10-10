const db = require('./../Config')
const response = require('./../Response')
const moment = require('../utilities/moment')
const absenSiswaUtils = require('../utilities/AbsenSiswaUtils')

const dataPresensi = async (req, res) => {
    try {
        const dataPresensi = await db('absen').join('siswa', 'absen.id_siswa', '=', 'siswa.id_siswa').select()
        return response(200, dataPresensi, 'Data presensi', res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const dataAbsensi = async (req, res) => {
    try {
        const dataKetidakhadiran = await db('absen').join('siswa', 'absen.id_siswa', '=', 'siswa.id_siswa').select().whereNull('absen.waktu_absen')
        return response(200, dataKetidakhadiran, 'Data absenssi', res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const dataAbsensiKelas = async (req, res) => {
    try {
        const kelasId = req.params.kelas_id
        const dataKetidakhadiran = await db('absen').join('siswa', 'absen.id_siswa', '=', 'siswa.id_siswa').where('siswa.kelas_id', kelasId)
        return response(200, dataKetidakhadiran, 'Data absensi', res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const updateAbsen = async (req, res) => {
    try {
        const id_siswa = req.params.id_siswa
        const { keterangan } = req.body

        // Cek absen individu
        const dataAbsen = await absenSiswaUtils.dataAbsensiSiswaIndividu(id_siswa)
        if (!dataAbsen) return response(404, null, `ID Anda tidak terdaftar!`, res)

        // Jika sudah ada rekap hari ini dan ada rekap lagi maka update
        absenSiswaUtils.filterRekap(id_siswa)

        if (!keterangan) return response(404, null, `Keterangan wajib diisi!`, res)

        // Jika keterangan hadir
        if (keterangan === 'H') {
            const updateAbsen = await db('absen').where('id_siswa', id_siswa).update({
                waktu_absen: moment().format('HH:mm:ss'),
                izin: null,
                keterangan: ''
            })
            return response(201, dataAbsen, `Berhasil absen!`, res)
        } 
        // Jika terlambat
        else if (keterangan === 'T') { 
            const updateAbsen = await db('absen').where('id_siswa', id_siswa).update({
                waktu_absen: moment().format('HH:mm:ss'),
                izin: null,
                keterangan
            })
            absenSiswaUtils.absenTerlambat(id_siswa)
            return response(201, updateAbsen, `Berhasil absen!`, res)
        } 
        // Jika sakit atau izin atau alfa
        else {
            const updateAbsen = await db('absen').where('id_siswa', id_siswa).update({
                waktu_absen: null,
                izin: moment().format('YYYY-MM-DD'),
                keterangan
            })
            await db('rekap_siswa').insert({
                tanggal: moment().format('YYYY-MM-DD'),
                siswa_id: id_siswa,
                keterangan,
                waktu_absen: null
            }).onConflict('tanggal').merge()
            return response(201, null, `Berhasil absen!`, res)
        }
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const engineAbsenSiswa = async (req, res) => {
    try {
        const { userabsen } = req.body
        const dataAbsen = await absenSiswaUtils.dataAbsensiSiswaIndividu(userabsen)
    
        // Jika ID user tidak terdaftar
        if (dataAbsen.length < 1) {
            return response(404, null, `ID Anda tidak terdaftar!`, res)
        } else {
            // Ambil informasi jam masuk hari ini
            const dataJamMasuk = await absenSiswaUtils.jamMasuk()
            const jam_masuk = moment(dataJamMasuk.masuk, 'HH:mm:ss').format('HH:mm:ss')
    
            // Jika melewati batas jam masuk
            if (jam_masuk < moment().format('HH:mm:ss')) {
                absenSiswaUtils.absenTerlambat(userabsen)
            }
    
            // Jika sudah absen hari ini
            if (dataAbsen.waktu_absen != null) {
                return response(200, dataAbsen, `${dataAbsen.nama_siswa} Sudah Absen!`, res)
            }
    
            // Update DB sesuai kondisi
            const engine = await db('absen').where('id_siswa', userabsen).update({
                waktu_absen: moment().format('HH:mm:ss'),
                izin: null,
                keterangan: ''
            })
            return response(201, engine, 'Berhasil Absen!', res)
        }
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const diagramHadir = async (req, res) => {
    try {
        const diagramHadir = await db('absen').where('keterangan', '!=', 'T').whereNotNull('waktu_absen').select()
        return response(200, diagramHadir, `Data Kehadiran`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const diagramTerlambat = async (req, res) => {
    try {
        const masuk = await absenSiswaUtils.jamMasuk()
        const diagramTerlambat = await db('absen').where('waktu_absen', '>', moment(masuk.masuk, 'HH:mm:ss').format('HH:mm:ss')).select()
        return response(200, diagramTerlambat, `Data Kehadiran`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const diagramSakit = async (req, res) => {
    try {
        const diagramSakit = await db('absen').where('keterangan', 'S').select()
        return response(200, diagramSakit, `Data Sakit`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const diagramIzin = async (req, res) => {
    try {
        const diagramIzin = await db('absen').where('keterangan', 'I').select()
        return response(200, diagramIzin, `Data Sakit`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const diagramAlfa = async (req, res) => {
    try {
        const diagramAlfa = await db('absen').whereNull('waktu_absen').select()
        return response(200, diagramAlfa, `Data Alfa`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const grafikMingguan = async (req, res) => {
    const dataTerlambat = await db('rekap_siswa')
        .count('tanggal as terlambat')
        .where('tanggal', '<=', moment().format('YYYY-MM-DD'))
        .where('keterangan', 'T')
        .groupBy('tanggal')
        .orderBy('tanggal', 'desc')
        .limit(7)
    const terlambat = dataTerlambat.map(item => item.terlambat)

    const dataSakit = await db('rekap_siswa')
        .count('tanggal as sakit')
        .where('tanggal', '<=', moment().format('YYYY-MM-DD'))
        .where('keterangan', 'S')
        .groupBy('tanggal')
        .orderBy('tanggal', 'desc')
        .limit(7)
    const sakit = dataSakit.map(item => item.sakit)

    const dataIzin = await db('rekap_siswa')
        .count('tanggal as izin')
        .where('tanggal', '<=', moment().format('YYYY-MM-DD'))
        .where('keterangan', 'I')
        .groupBy('tanggal')
        .orderBy('tanggal', 'desc')
        .limit(7)
    const izin = dataIzin.map(item => item.izin)

    const dataAlfa = await db('rekap_siswa')
        .count('tanggal as alfa')
        .where('tanggal', '<=', moment().format('YYYY-MM-DD'))
        .where('keterangan', 'A')
        .groupBy('tanggal')
        .orderBy('tanggal', 'desc')
        .limit(7)
    const alfa = dataAlfa.map(item => item.alfa)

    const dataTanggal = await db('rekap_siswa')
        .select('tanggal')
        .groupBy('tanggal')
        .orderBy('tanggal', 'desc')
        .limit(7)

    const tanggal = dataTanggal.map(item => moment(item.tanggal).format('YYYY-MM-DD'))

    return response(200, { tanggal, terlambat, sakit, izin, alfa }, `Grafik`, res)
}

const rekap = async (req, res) => {
    const { kelas, range } = req.query
    let dari, sampai = ''
    if (!kelas || !range) return response(400, null, `Invalid request parameter!`, res)

    if (kelas == undefined || range == undefined) return response(400, null, `Invalid request parameter!`, res)

    if (range.length === 10) {
        dari = range
        sampai = range
    }else{ 
        dari = range.substring(0, 10)
        sampai = range.substring(14, 24)
    }

    const rekap = await db('siswa')
        .select(
            's.id_siswa',
            's.nama_siswa',
            db.raw('SUM(CASE WHEN rs.keterangan = "S" THEN 1 ELSE 0 END) AS S'),
            db.raw('SUM(CASE WHEN rs.keterangan = "I" THEN 1 ELSE 0 END) AS I'),
            db.raw('SUM(CASE WHEN rs.keterangan = "A" THEN 1 ELSE 0 END) AS A'),
            db.raw('SUM(CASE WHEN rs.keterangan = "T" THEN 1 ELSE 0 END) AS T')
        )
        .from('siswa AS s')
        .join('rekap_siswa AS rs', 's.id_siswa', 'rs.siswa_id')
        .whereBetween('rs.tanggal', [dari, sampai])
        .andWhere('s.kelas_id', kelas)
        .groupBy('s.id_siswa', 's.nama_siswa')

    return response(200, rekap, `Rekap`, res)
}

module.exports = {
    dataPresensi,
    dataAbsensi,
    dataAbsensiKelas,
    updateAbsen,
    engineAbsenSiswa,
    diagramHadir,
    diagramTerlambat,
    diagramAlfa,
    diagramSakit,
    diagramIzin,
    grafikMingguan,
    rekap
} 