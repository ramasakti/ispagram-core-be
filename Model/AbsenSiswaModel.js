const db = require('../Config')
const Moment = require('../utilities/Moment')
const AbsenSiswaUtils = require('../utilities/AbsenSiswaUtils')

const dataAllAbsensiSiswa = async (trx = db) => await trx('absen').join('detail_siswa', 'absen.id_siswa', '=', 'detail_siswa.id_siswa')

const dataAllKetidakhadiranSiswa = async (trx = db) => {
    return await trx('absen')
        .select('detail_siswa.nama_siswa', 'absen.keterangan', 'kelas.id_kelas', 'kelas.tingkat', 'kelas.jurusan')
        .join('detail_siswa', 'detail_siswa.id_siswa', '=', 'absen.id_siswa')
        .join('siswa', 'siswa.id_siswa', '=', 'absen.id_siswa')
        .join('kelas', 'kelas.id_kelas', '=', 'siswa.kelas_id')
        .whereNull('absen.waktu_absen')
}

const getAllSiswaTerlambat = async (trx = db) => {
    const masuk = await AbsenSiswaUtils.jamMasuk()
    return await trx('absen')
        .select('detail_siswa.nama_siswa', 'absen.keterangan', 'absen.waktu_absen', 'kelas.id_kelas', 'kelas.tingkat', 'kelas.jurusan')
        .join('detail_siswa', 'absen.id_siswa', '=', 'detail_siswa.id_siswa')
        .join('siswa', 'siswa.id_siswa', '=', 'absen.id_siswa')
        .join('kelas', 'kelas.id_kelas', '=', 'siswa.kelas_id')
        .where('absen.waktu_absen', '>', masuk.masuk)
        .andWhere('absen.keterangan', 'T')
}

const dataKetidakhadiranKelas = async (kelas_id, trx = db) => {
    return await trx('absen')
        .join('siswa', 'siswa.id_siswa', '=', 'absen.id_siswa')
        .join('detail_siswa', 'absen.id_siswa', '=', 'detail_siswa.id_siswa')
        .where('siswa.kelas_id', kelas_id)
}

const dataAbsensiSiswaIndividu = async (id_siswa, trx = db) => {
    return await trx('absen')
        .select('detail_siswa.nama_siswa', 'absen.waktu_absen', 'users.avatar')
        .join('detail_siswa', 'absen.id_siswa', '=', 'detail_siswa.id_siswa')
        .join('users', 'users.username', '=', 'absen.id_siswa')
        .where('detail_siswa.id_siswa', id_siswa)
        .first()
}

const insertAbsen = async (id_siswa, trx = db) => await trx('absen').insert({ id_siswa })

const updateHadir = async (id_siswa, trx = db) => {
    return await trx('absen').where('id_siswa', id_siswa).update({
        waktu_absen: Moment().format('HH:mm:ss'),
        izin: null,
        keterangan: 'H'
    })
}

const updateAbsenOrTerlambat = async (id_siswa, keterangan, trx = db) => {
    return await trx('absen')
        .where('id_siswa', id_siswa)
        .update({
            waktu_absen: (keterangan !== 'T') ? null : Moment().format('HH:mm:ss'),
            izin: (keterangan !== 'T') ? Moment().format('YYYY-MM-DD') : null,
            keterangan
        })
}

const rekap = async (kelas, dari, sampai, trx = db) => {
    return await trx('siswa')
        .select(
            's.id_siswa',
            'detail_siswa.nama_siswa',
            db.raw('SUM(CASE WHEN rs.keterangan = "S" THEN 1 ELSE 0 END) AS S'),
            db.raw('SUM(CASE WHEN rs.keterangan = "I" THEN 1 ELSE 0 END) AS I'),
            db.raw('SUM(CASE WHEN rs.keterangan = "A" THEN 1 ELSE 0 END) AS A'),
            db.raw('SUM(CASE WHEN rs.keterangan = "T" THEN 1 ELSE 0 END) AS T')
        )
        .from('siswa AS s')
        .join('detail_siswa', 'detail_siswa.id_siswa', '=', 's.id_siswa')
        .join('rekap_siswa AS rs', 's.id_siswa', 'rs.siswa_id')
        .whereBetween('rs.tanggal', [dari, sampai])
        .andWhere('s.kelas_id', kelas)
        .groupBy('s.id_siswa', 'detail_siswa.nama_siswa')
}

const rekapIndividu = async (id_siswa, trx = db) => {
    return await trx('siswa')
        .select(
            'siswa.id_siswa',
            'detail_siswa.nama_siswa',
            db.raw('SUM(CASE WHEN rekap_siswa.keterangan = "S" THEN 1 ELSE 0 END) AS S'),
            db.raw('SUM(CASE WHEN rekap_siswa.keterangan = "I" THEN 1 ELSE 0 END) AS I'),
            db.raw('SUM(CASE WHEN rekap_siswa.keterangan = "A" THEN 1 ELSE 0 END) AS A'),
            db.raw('SUM(CASE WHEN rekap_siswa.keterangan = "T" THEN 1 ELSE 0 END) AS T')
        )
        .join('rekap_siswa', 'siswa.id_siswa', '=', 'rekap_siswa.siswa_id')
        .join('detail_siswa', 'siswa.id_siswa', '=', 'detail_siswa.id_siswa')
        .where('siswa.id_siswa', id_siswa)
        .groupBy('siswa.id_siswa', 'detail_siswa.nama_siswa')
        .first()
}

const statistikHarian = async (trx = db) => {
    return await trx('absen')
        .select(
            db.raw('SUM(CASE WHEN absen.waktu_absen IS NOT NULL AND absen.keterangan = "H" THEN 1 ELSE 0 END) AS H'),
            db.raw('SUM(CASE WHEN absen.keterangan = "S" THEN 1 ELSE 0 END) AS S'),
            db.raw('SUM(CASE WHEN absen.keterangan = "I" THEN 1 ELSE 0 END) AS I'),
            db.raw('SUM(CASE WHEN absen.keterangan = "A" OR absen.keterangan = "" OR absen.keterangan IS NULL AND absen.waktu_absen IS NULL THEN 1 ELSE 0 END) AS A'),
            db.raw('SUM(CASE WHEN absen.keterangan = "T" THEN 1 ELSE 0 END) AS T')
        )
        .first();
}

const statistikMingguan = async (trx = db) => {
    return await trx('rekap_siswa')
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

const whatsapp = async (id_siswa, trx = db) => {
    return await trx('siswa')
        .select('siswa.id_siswa', 'detail_siswa.nama_siswa', 'detail_siswa.telp', 'detail_siswa.ayah', 'detail_siswa.telp_ayah', 'detail_siswa.ibu', 'detail_siswa.telp_ibu')
        .join('detail_siswa', 'detail_siswa.id_siswa', '=', 'siswa.id_siswa')
        .where('siswa.id_siswa', id_siswa).first()
}

const updateAbsenToDefault = async (trx = db) => {
    return await trx('absen').update({
        waktu_absen: null,
        keterangan: ''
    })
} 

module.exports = {
    dataAllAbsensiSiswa,
    dataAllKetidakhadiranSiswa,
    getAllSiswaTerlambat,
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
