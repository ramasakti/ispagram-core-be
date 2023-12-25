const db = require('../Config')

const getAllGuru = async () => await db('guru')

const getAllGuruStaf = async () => await db('guru').where('staf', true)

const getGuruByID = async (id_guru) => await db('guru').where('id_guru', id_guru).first()

const getGuruAndUserInfoByID = async (id_guru) => {
    return await db('guru')
        .join('users', 'users.username', '=', 'guru.id_guru')
        .where('guru.id_guru', id_guru)
        .first()
}

const getDetailGuruByID = async (id_guru) => {
    return await db('guru')
        .join('detail_guru', 'detail_guru.guru_id', '=', 'guru.id_guru')
        .where('guru.id_guru', id_guru)
        .first()
}

const insertGuru = async (req) => {
    return await db('guru').insert(req)
}

const updateGuru = async (id_guru, req) => {
    return await db('guru').where('id_guru', id_guru).update(req)
}

const updateDetailGuru = async (id_guru, req) => {
    return await db('detail_guru').where('guru_id', id_guru).update(req)
}

const deleteGuru = async (id_guru) => await db('guru').where('id_guru', id_guru).del()

module.exports = {
    getAllGuru,
    getAllGuruStaf,
    getGuruByID,
    getGuruAndUserInfoByID,
    getDetailGuruByID,
    insertGuru,
    updateGuru,
    updateDetailGuru,
    deleteGuru
};
