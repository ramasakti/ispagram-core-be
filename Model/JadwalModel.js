const db = require('../Config')

const getAllJadwal = async (trx = db) => await trx('jadwal')

const getJadwalByID = async (id_jadwal, trx = db) => await trx('jadwal').where('id_jadwal', id_jadwal).first()

const getFullJadwalByDateNow = async (tanggal, trx = db) => {
    return await trx('jadwal')
        .join('jam_pelajaran', 'jadwal.jampel', '=', 'jam_pelajaran.id_jampel')
        .join('mapel', 'mapel.id_mapel', '=', 'jadwal.mapel')
        .join('kelas', 'kelas.id_kelas', '=', 'mapel.kelas_id')
        .join('guru', 'guru.id_guru', '=', 'jadwal.guru_id')
        .leftJoin('jurnal', 'jurnal.jadwal_id', '=', 'jadwal.id_jadwal')
        .where('jurnal.tanggal', tanggal)
        .orWhereNull('jurnal.tanggal')
        .orderBy('kelas.id_kelas', 'ASC')
        .orderBy('jam_pelajaran.id_jampel', 'ASC')
}

const getJadwalInARow = async (trx = db) => {

}

const getJadwalByGuru = async (id_guru, trx = db) => {

}

const getJadwalByHari = async (hari, trx = db) => {

}

const insertJadwal = async (req, trx = db) => {
    return await trx('jadwal').insert(req)
}

const updateJadwal = async (id_jadwal, req, trx = db) => {
    return await trx('jadwal').where('id_jadwal', id_jadwal).update(req)
}

module.exports = {
    getAllJadwal,
    getJadwalByID,
    getFullJadwalByDateNow,
    insertJadwal,
    updateJadwal
};
