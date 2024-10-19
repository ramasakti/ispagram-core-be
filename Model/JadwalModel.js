const Moment = require('../utilities/Moment')

const getAllJadwal = async (trx) => await trx('jadwal')

const getJadwalByID = async (id_jadwal, trx) => await trx('jadwal').where('id_jadwal', id_jadwal).first()

const getFullJadwalByDateNow = async (tanggal, trx) => {
    return await trx('jadwal')
        .select(
            'jadwal.id_jadwal',
            'jadwal.jampel',
            'jam_pelajaran.hari',
            'jam_pelajaran.keterangan',
            'jam_pelajaran.mulai',
            'jam_pelajaran.selesai',
            'guru.id_guru',
            'guru.nama_guru',
            'mapel.id_mapel as mapel',
            'mapel.nama_mapel',
            'kelas.id_kelas as kelas_id',
            'kelas.tingkat',
            'kelas.jurusan',
            'jurnal.id_jurnal',
            'jurnal.inval'
        )
        .join('jam_pelajaran', 'jadwal.jampel', '=', 'jam_pelajaran.id_jampel')
        .join('mapel', 'mapel.id_mapel', '=', 'jadwal.mapel')
        .join('kelas', 'kelas.id_kelas', '=', 'jadwal.kelas_id')
        .join('guru', 'guru.id_guru', '=', 'jadwal.guru_id')
        .leftJoin('jurnal', function () {
            this.on('jurnal.jadwal_id', '=', 'jadwal.id_jadwal')
                .andOn(function () {
                    this.on('jurnal.tanggal', '=', trx.raw('?', [tanggal]))
                        .orOnNull('jurnal.tanggal');
                });
        })
        .orderBy('kelas.id_kelas', 'ASC')
        .orderBy('jam_pelajaran.mulai', 'ASC');
}

const getJadwalInARowByGuru = async (guru_id, trx) => {
    return await trx('jadwal')
        .select(
            'jadwal.id_jadwal',
            'guru.id_guru',
            'guru.nama_guru',
            'jam_pelajaran.keterangan',
            'jam_pelajaran.mulai',
            'jam_pelajaran.selesai',
            'mapel.nama_mapel AS mapel'
        )
        .join('jam_pelajaran', 'jam_pelajaran.id_jampel', '=', 'jadwal.jampel')
        .join('guru', 'guru.id_guru', '=', 'jadwal.guru_id')
        .join('mapel', 'mapel.id_mapel', '=', 'jadwal.mapel')
        .whereIn('jadwal.mapel', function () {
            this.select('jadwal.mapel')
                .from('jadwal')
                .join('jam_pelajaran', 'jam_pelajaran.id_jampel', '=', 'jadwal.jampel')
                .where('jam_pelajaran.mulai', '<=', Moment().format('HH:mm:ss'))
                .andWhere('jam_pelajaran.selesai', '>=', Moment().format('HH:mm:ss'));
        })
        .andWhere('guru.id_guru', guru_id)
        .orderBy('jam_pelajaran.mulai', 'ASC')
}

const getJadwalWithJampelByIDJadwal = async (id_jadwal, trx) => {
    return await trx('jadwal')
        .join('jam_pelajaran', 'jam_pelajaran.id_jampel', '=', 'jadwal.jampel')
        .where('id_jadwal', id_jadwal)
        .first()
}

const getJadwalByGuru = async (id_guru, tanggal, trx) => {
    return await trx('jadwal')
        .select(
            'jadwal.id_jadwal',
            'jadwal.jampel',
            'jam_pelajaran.hari',
            'jam_pelajaran.keterangan',
            'jam_pelajaran.mulai',
            'jam_pelajaran.selesai',
            'guru.id_guru',
            'guru.nama_guru',
            'mapel.id_mapel as mapel',
            'mapel.nama_mapel',
            'kelas.id_kelas as kelas_id',
            'kelas.tingkat',
            'kelas.jurusan',
            'jurnal.id_jurnal',
            'jurnal.inval'
        )
        .join('jam_pelajaran', 'jadwal.jampel', '=', 'jam_pelajaran.id_jampel')
        .join('mapel', 'mapel.id_mapel', '=', 'jadwal.mapel')
        .join('kelas', 'kelas.id_kelas', '=', 'jadwal.kelas_id')
        .join('guru', 'guru.id_guru', '=', 'jadwal.guru_id')
        .leftJoin('jurnal', function () {
            this.on('jurnal.jadwal_id', '=', 'jadwal.id_jadwal')
                .andOn(function () {
                    this.on('jurnal.tanggal', '=', trx.raw('?', [tanggal]))
                        .orOnNull('jurnal.tanggal');
                });
        })
        .where('jadwal.guru_id', id_guru)
        .orderBy('kelas.id_kelas', 'ASC')
        .orderBy('jam_pelajaran.mulai', 'ASC')
}

const getJadwalByHari = async (hari, trx) => {

}

const insertJadwal = async (req, trx) => {
    return await trx('jadwal').insert(req)
}

const updateJadwal = async (id_jadwal, req, trx) => {
    return await trx('jadwal').where('id_jadwal', id_jadwal).update(req)
}

const deleteJadwalByID = async (id_jadwal, trx) => await trx('jadwal').where('id_jadwal', id_jadwal).del()

module.exports = {
    getAllJadwal,
    getJadwalByID,
    getFullJadwalByDateNow,
    getJadwalInARowByGuru,
    getJadwalWithJampelByIDJadwal,
    insertJadwal,
    updateJadwal,
    deleteJadwalByID,
    getJadwalByGuru
};
