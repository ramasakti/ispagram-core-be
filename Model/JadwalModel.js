const db = require('../Config')

const getAllJadwal = async () => await db('jadwal')

const getJadwalByID = async (id_jadwal) => await db('jadwal').where('id_jadwal', id_jadwal).first()

const getFullJadwalByDateNow = async (tanggal) => {
    return await db('jadwal')
        .join('jam_pelajaran', 'jadwal.jampel', '=', 'jam_pelajaran.id_jampel')
        .join('kelas', 'jadwal.kelas_id', '=', 'kelas.id_kelas')
        .join('guru', 'jadwal.guru_id', '=', 'guru.id_guru')
        .leftJoin('jurnal', 'jurnal.jadwal_id', '=', 'jadwal.id_jadwal')
        .where('jurnal.tanggal', tanggal)
        .orWhereNull('jurnal.tanggal')
        .orderBy('kelas.id_kelas', 'ASC')
        .orderBy('jam_pelajaran.id_jampel', 'ASC')
}

const getJadwalInARow = async () => {

}

const getJadwalByGuru = async (id_guru) => {

}

const getJadwalByHari = async (hari) => {

}

const insertJadwal = async (req) => {
    return await db('jadwal').insert(req)
}

const updateJadwal = async (id_jadwal, req) => {
    return await db('jadwal').where('id_jadwal', id_jadwal).update(req)
}

module.exports = {
    getAllJadwal,
    getJadwalByID,
    getFullJadwalByDateNow,
    insertJadwal,
    updateJadwal
};
