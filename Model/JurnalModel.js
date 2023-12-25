const db = require('../Config')
const Moment = require('./../utilities/Moment')

const getJurnalByJadwalAndDateNow = async (id_jadwal) => {
    return await db('jurnal')
        .whereIn('jadwal_id', id_jadwal)
        .where('tanggal', moment().format('YYYY-MM-DD'))
}

const getJurnalByDateAndKelas = async (tanggal, kelas_id) => {
    return await db('jurnal')
        .select(
            'jurnal.*',
            'jadwal.id_jadwal',
            'jadwal.mapel',
            'guru.nama_guru',
            'guru.telp',
            'jam_pelajaran.mulai',
            'jam_pelajaran.selesai',
        )
        .join('jadwal', 'jadwal.id_jadwal', '=', 'jurnal.jadwal_id')
        .join('guru', 'guru.id_guru', '=', 'jadwal.guru_id')
        .join('jam_pelajaran', 'jam_pelajaran.id_jampel', '=', 'jadwal.jampel')
        .where('jurnal.tanggal', tanggal)
        .where('jadwal.kelas_id', kelas_id)
}

module.exports = {
    getJurnalByJadwalAndDateNow,
    getJurnalByDateAndKelas
};
