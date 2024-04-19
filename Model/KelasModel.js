const db = require('../Config')

const getAllKelas = async (trx = db) => await trx('kelas')

const getAllKelasWithWalas = async (trx = db) => await trx('kelas').join('guru', 'guru.id_guru', '=', 'kelas.walas')

const getKelasWithWalasByWalas = async (walas, trx = db) => {
    return await trx('kelas')
        .join('guru', 'guru.id_guru', '=', 'kelas.walas')
        .where('kelas.walas', walas)
        .first()
}

const getKelasById = async (id_kelas, trx = db) => await trx('kelas').where('id_kelas', id_kelas).first()

const getKelasByWalas = async (walas, trx = db) => await trx('kelas').where('walas', walas).first()

const getKelasByTingkat = async (tingkat, trx = db) => await trx('kelas').where('tingkat', tingkat)

const getSiswaByTingkat = async (tingkat, trx = db) => await trx('kelas').join('siswa', 'siswa.kelas_id', 'kelas.id_kelas').where('kelas.tingkat', tingkat)

const getKelasWithWalasByID = async (id_kelas, trx = db) => {
    return await trx('kelas')
        .join('guru', 'guru.id_guru', '=', 'kelas.walas')
        .where('kelas.id_kelas', id_kelas)
        .first()
}

const insertKelas = async (req, trx = db) => await trx('kelas').insert(req)

const updateKelas = async (id_kelas, req, trx = db) => await trx('kelas').where('id_kelas', id_kelas).update(req)

const graduateKelas = async (trx = db) => {
    await trx('kelas')
        .update({
            tingkat: trx.raw(`CASE WHEN tingkat = 'X' THEN 'XI' WHEN tingkat = 'XI' THEN 'XII' END`)
        })
}

const deleteKelas = async (id_kelas, trx = db) => await trx('kelas').where('id_kelas', id_kelas).del()

const deleteKelasByTingkat = async (tingkat, trx = db) => await trx('kelas').where('tingkat', tingkat).del()

module.exports = {
    getAllKelas,
    getAllKelasWithWalas,
    getKelasWithWalasByWalas,
    getKelasById,
    getKelasWithWalasByID,
    getKelasByWalas,
    getKelasByTingkat,
    getSiswaByTingkat,
    insertKelas,
    updateKelas,
    graduateKelas,
    deleteKelas,
    deleteKelasByTingkat
};
