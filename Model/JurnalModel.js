const db = require('../Config')
const Moment = require('./../utilities/Moment')

const getJurnalByJadwalAndDateNow = async (id_jadwal, trx = db) => {
    return await trx('jurnal')
        .whereIn('jadwal_id', id_jadwal)
        .where('tanggal', moment().format('YYYY-MM-DD'))
}

const getJurnalByDateAndKelas = async (tanggal, kelas_id, trx = db) => {
    return await trx('jurnal')
        .select(
            'jurnal.*',
            'jadwal.id_jadwal',
            'kelas.tingkat',
            'kelas.jurusan',
            'mapel.nama_mapel as mapel',
            'guru.nama_guru',
            'guru.telp',
            'jam_pelajaran.keterangan',
            'jam_pelajaran.mulai',
            'jam_pelajaran.selesai',
        )
        .join('jadwal', 'jadwal.id_jadwal', '=', 'jurnal.jadwal_id')
        .join('mapel', 'mapel.id_mapel', '=', 'jadwal.mapel')
        .join('kelas', 'kelas.id_kelas', '=', 'mapel.kelas_id')
        .join('guru', 'guru.id_guru', '=', 'jadwal.guru_id')
        .join('jam_pelajaran', 'jam_pelajaran.id_jampel', '=', 'jadwal.jampel')
        .where('jurnal.tanggal', tanggal)
        .where('mapel.kelas_id', kelas_id)
}

module.exports = {
    getJurnalByJadwalAndDateNow,
    getJurnalByDateAndKelas
};
