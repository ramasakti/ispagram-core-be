const db = require('../Config')

const getAllKelas = async () => await db('kelas')

const getAllKelasWithWalas = async () => await db('kelas').join('guru', 'guru.id_guru', '=', 'kelas.walas')

const getKelasWithWalasByWalas = async (walas) => {
    return await db('kelas')
        .join('guru', 'guru.id_guru', '=', 'kelas.walas')
        .where('kelas.walas', walas)
        .first()
}

const getKelasById = async (id_kelas) => await db('kelas').where('id_kelas', id_kelas).first()

const getKelasByWalas = async (walas) => await db('kelas').where('walas', walas).first()

const getKelasByTingkat = async (tingkat) => await db('kelas').where('tingkat', tingkat).first()

const getKelasWithWalasByID = async (id_kelas) => {
    return await db('kelas')
        .join('guru', 'guru.id_guru', '=', 'kelas.id_kelas')
        .where('kelas.id_kelas', id_kelas)
        .first()
}

const insertKelas = async (req) => await db('kelas').insert(req)

const updateKelas = async (id_kelas, req) => await db('kelas').where('id_kelas', id_kelas).update(req)

const deleteKelas = async (id_kelas) => await db('kelas').where('id_kelas', id_kelas).del()

module.exports = {
    getAllKelas,
    getAllKelasWithWalas,
    getKelasWithWalasByWalas,
    getKelasById,
    getKelasWithWalasByID,
    getKelasByWalas,
    getKelasByTingkat,
    insertKelas,
    updateKelas,
    deleteKelas
};
