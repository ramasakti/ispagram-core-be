const getAllGuru = async (trx) => await trx('guru')

const getAllGuruStaf = async (trx) => await trx('guru').where('staf', true)

const getGuruByID = async (id_guru, trx) => await trx('guru').where('id_guru', id_guru).first()

const getGuruAndUserInfoByID = async (id_guru, trx) => {
    return await trx('guru')
        .join('users', 'users.username', '=', 'guru.id_guru')
        .where('guru.id_guru', id_guru)
        .first()
}

const getDetailGuruByID = async (id_guru, trx) => {
    return await trx('guru')
        .join('detail_guru', 'detail_guru.guru_id', '=', 'guru.id_guru')
        .where('guru.id_guru', id_guru)
        .first()
}

const insertGuru = async (req, trx) => await trx('guru').insert(req)

const updateGuru = async (id_guru, req, trx) => await trx('guru').where('id_guru', id_guru).update(req)

const updateDetailGuru = async (id_guru, req, trx) => await trx('detail_guru').where('guru_id', id_guru).update(req)

const deleteGuru = async (id_guru, trx) => await trx('guru').where('id_guru', id_guru).del()

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
