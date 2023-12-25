const db = require('../Config')

const getAllSiswa = async () => await db('siswa')

const getSiswaByID = async (id_siswa) => await db('siswa').where('id_siswa', id_siswa).first()

const getSiswaAndUserInfoByID = async (id_siswa) => {
    return await db('siswa')
        .join('users', 'users.username', '=', 'siswa.id_siswa')
        .where('siswa.id_siswa', id_siswa)
        .first()
}

const getDetailSiswaByID = async (id_siswa) => {
    return await db('siswa')
        .join('detail_siswa', 'detail_siswa.siswa_id', '=', 'siswa.id_siswa')
        .where('siswa.id_siswa', id_siswa)
        .first()
}

const getSiswaByKelas = async (id_kelas) => {
    return await db('siswa')
        .join('kelas', 'kelas.id_kelas', '=', 'siswa.kelas_id')
        .where('siswa.kelas_id', id_kelas)
}

const insertSiswa = async (req) => {
    return await db('siswa').insert(req)
}

const updateSiswaByID = async (id_siswa, req) => {
    return await db('siswa').where('id_siswa', id_siswa).update(req)
}

const deleteSiswa = async (id_siswa) => {
    return await db('siswa').where('id_siswa', id_siswa).del()
}

const updateDetailSiswaByID = async (id_siswa, req) => {
    return await db('siswa').where('siswa_id', id_siswa).update(req)
}

const getAllIDSiswa = async () => await db('siswa').pluck('id_siswa')

module.exports = {
    getAllSiswa,
    getSiswaByID,
    getSiswaAndUserInfoByID,
    getDetailSiswaByID,
    getSiswaByKelas,
    insertSiswa,
    updateSiswaByID,
    deleteSiswa,
    updateDetailSiswaByID,
    getAllIDSiswa
};
