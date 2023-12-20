const db = require('../Config')
const Moment = require('./../Utilities/Moment')

const dataAllAbsensiSiswa = async () => await db('absen').join('siswa', 'absen.id_siswa', '=', 'siswa.id_siswa')

const dataAllKetidakhadiranSiswa = async () => {
    return await db('absen')
        .join('siswa', 'absen.id_siswa', '=', 'siswa.id_siswa')
        .whereNull('absen.waktu_absen')
}

const dataKetidakhadiranKelas = async (kelas_id) => {
    return await db('absen')
        .join('siswa', 'absen.id_siswa', '=', 'siswa.id_siswa')
        .where('siswa.kelas_id', kelas_id)
}

const dataAbsensiSiswaIndividu = async (id_siswa) => {
    return await db('absen')
        .join('siswa', 'absen.id_siswa', '=', 'siswa.id_siswa')
        .select('siswa.nama_siswa', 'absen.waktu_absen')
        .where('siswa.id_siswa', id_siswa)
        .first()
}

const insertAbsen = async (id_siswa) => await db('absen').insert({ id_siswa })

const updateHadir = async (id_siswa) => {
    return await db('absen').where('id_siswa', id_siswa).update({
        waktu_absen: Moment().format('HH:mm:ss'),
        izin: null,
        keterangan: 'H'
    })
}

const updateAbsenOrTerlambat = async (id_siswa, keterangan) => {
    return await db('absen').where('id_siswa', id_siswa).update({
        waktu_absen: (keterangan !== 'T') ? null : Moment().format('HH:mm:ss'),
        izin: (keterangan !== 'T') ? Moment().format('YYYY-MM-DD') : null,
        keterangan
    })
}

const rekap = async (kelas, dari, sampai) => {
    return await db('siswa')
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
}

const rekapIndividu = async (id_siswa) => {
    return await db('siswa')
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
        .where('s.id_siswa', id_siswa)
        .groupBy('s.id_siswa', 's.nama_siswa')
        .first()
}

const statistikHarian = async () => {
    return await db('absen')
        .select(
            db.raw('SUM(CASE WHEN absen.waktu_absen IS NOT NULL AND absen.keterangan = "" THEN 1 ELSE 0 END) AS H'),
            db.raw('SUM(CASE WHEN absen.keterangan = "S" THEN 1 ELSE 0 END) AS S'),
            db.raw('SUM(CASE WHEN absen.keterangan = "I" THEN 1 ELSE 0 END) AS I'),
            db.raw('SUM(CASE WHEN absen.keterangan = "A" OR absen.keterangan = "" OR absen.keterangan IS NULL AND absen.waktu_absen IS NULL THEN 1 ELSE 0 END) AS A'),
            db.raw('SUM(CASE WHEN absen.keterangan = "T" THEN 1 ELSE 0 END) AS T')
        )
        .first();
}

const statistikMingguan = async () => {
    return await db('rekap_siswa')
        .select(
            'tanggal',
            db.raw('SUM(CASE WHEN rekap_siswa.keterangan = "S" THEN 1 ELSE 0 END) AS S'),
            db.raw('SUM(CASE WHEN rekap_siswa.keterangan = "I" THEN 1 ELSE 0 END) AS I'),
            db.raw('SUM(CASE WHEN rekap_siswa.keterangan = "A" THEN 1 ELSE 0 END) AS A'),
            db.raw('SUM(CASE WHEN rekap_siswa.keterangan = "T" THEN 1 ELSE 0 END) AS T')
        )
        .where('tanggal', '<=', Moment().format('YYYY-MM-DD'))
        .groupBy('rekap_siswa.tanggal')
        .orderBy('tanggal', 'desc')
        .limit(7)
}

const whatsapp = async (id_siswa) => {
    return await db('siswa')
        .select('siswa.id_siswa', 'siswa.telp', 'detail_siswa.ayah', 'detail_siswa.telp_ayah', 'detail_siswa.ibu', 'detail_siswa.telp_ibu')
        .join('detail_siswa', 'detail_siswa.siswa_id', '=', 'siswa.id_siswa')
        .where('id_siswa', id_siswa).first()
}

const updateAbsenToDefault = async () => {
    return await db('absen').update({
        waktu_absen: null,
        keterangan: ''
    })
} 

module.exports = {
    dataAllAbsensiSiswa,
    dataAllKetidakhadiranSiswa,
    dataKetidakhadiranKelas,
    dataAbsensiSiswaIndividu,
    insertAbsen,
    updateHadir,
    updateAbsenOrTerlambat,
    rekap,
    rekapIndividu,
    statistikHarian,
    statistikMingguan,
    whatsapp,
    updateAbsenToDefault
};
