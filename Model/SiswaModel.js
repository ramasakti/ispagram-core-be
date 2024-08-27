const getAllSiswaActive = async (trx) => await trx('siswa')

const getAllSiswa = async (trx) => await trx('siswa').join('detail_siswa', 'detail_siswa.id_siswa', '=', 'siswa.id_siswa')

const getSiswaByID = async (id_siswa, trx) => await trx('siswa').join('detail_siswa', 'detail_siswa.id_siswa', '=', 'siswa.id_siswa').where('siswa.id_siswa', id_siswa).first()

const getSiswaAndUserInfoByID = async (id_siswa, trx) => {
    return await trx('siswa')
        .join('detail_siswa', 'detail_siswa.id_siswa', '=', 'siswa.id_siswa')
        .join('users', 'users.username', '=', 'siswa.id_siswa')
        .where('siswa.id_siswa', id_siswa)
        .first()
}

const getSiswaByRFID = async (rfid, trx) => {
    return await trx('siswa')
        .join('detail_siswa', 'detail_siswa.id_siswa', '=', 'siswa.id_siswa')
        .join('users', 'users.username', '=', 'siswa.id_siswa')
        .join('role', 'role.id_role', '=', 'users.role')
        .where('siswa.rfid', rfid)
        .first()
}

const getDetailSiswaByID = async (id_siswa, trx) => await trx('detail_siswa').where('detail_siswa.id_siswa', id_siswa).first()

const getSiswaByKelas = async (id_kelas, trx) => {
    return await trx('siswa')
        .join('detail_siswa', 'detail_siswa.id_siswa', '=', 'siswa.id_siswa')
        .join('kelas', 'kelas.id_kelas', '=', 'siswa.kelas_id')
        .where('siswa.kelas_id', id_kelas)
}

const insertSiswa = async (req, trx) => await trx('siswa').insert(req)

const updateSiswaByID = async (id_siswa, req, trx) => await trx('siswa').where('id_siswa', id_siswa).update(req)

const deleteSiswa = async (id_siswa, trx) => await trx('siswa').where('id_siswa', id_siswa).del()

const updateDetailSiswaByID = async (id_siswa, req, trx) => await trx('detail_siswa').where('id_siswa', id_siswa).update(req)

const getAllIDSiswa = async (trx) => await trx('siswa').pluck('id_siswa')

const deleteSiswaByKelasID = async (kelas_id, trx) => await trx('siswa').where('kelas_id', kelas_id).del()

const insertDetailSiswa = async (req, trx) => await trx('detail_siswa').insert(req)

module.exports = {
    getAllSiswaActive,
    getAllSiswa,
    getSiswaByID,
    getSiswaAndUserInfoByID,
    getDetailSiswaByID,
    getSiswaByRFID,
    getSiswaByKelas,
    insertSiswa,
    updateSiswaByID,
    deleteSiswa,
    updateDetailSiswaByID,
    getAllIDSiswa,
    deleteSiswaByKelasID,
    insertDetailSiswa
};
