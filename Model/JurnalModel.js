const Moment = require('./../utilities/Moment')

const getJurnalByJadwalAndDateNow = async (id_jadwal, trx) => {
    return await trx('jurnal')
        .where('jadwal_id', id_jadwal)
        .where('tanggal', Moment().format('YYYY-MM-DD'))
}

const getJurnalByDateAndJadwalID = async (date, id_jadwal, trx) => await trx('jurnal').where('tanggal', date).where('jadwal_id', id_jadwal).first()

const getJurnalByDateAndKelas = async (tanggal, kelas_id, trx) => {
    return await trx('jurnal')
        .select(
            'jurnal.*',
            'jadwal.id_jadwal',
            'kelas.id_kelas as kelas',
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
        .join('kelas', 'kelas.id_kelas', '=', 'jadwal.kelas_id')
        .join('guru', 'guru.id_guru', '=', 'jadwal.guru_id')
        .join('jam_pelajaran', 'jam_pelajaran.id_jampel', '=', 'jadwal.jampel')
        .where('jurnal.tanggal', tanggal)
        .where('jadwal.kelas_id', kelas_id)
}

const updateJurnalByID = async (id_jurnal, req, trx) => {
    return await trx('jurnal')
        .where('id_jurnal', id_jurnal)
        .update(req)
}

const insertJurnal = async (req, trx) => await trx('jurnal').insert(req)

const deleteJurnalByID = async (id_jurnal, trx) => await trx('jurnal').where('id_jurnal', id_jurnal).del()

const deleteJurnalByDateAndJadwalID = async (date, id_jadwal, trx) => {
    return await trx('jurnal')
        .where('tanggal', date)
        .where('jadwal_id', id_jadwal)
        .del()
}
module.exports = {
    getJurnalByJadwalAndDateNow,
    getJurnalByDateAndKelas,
    getJurnalByDateAndJadwalID,
    updateJurnalByID,
    insertJurnal,
    deleteJurnalByID,
    deleteJurnalByDateAndJadwalID
};
