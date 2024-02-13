const db = require('../Config')

const insertDetailGuru = async (guru_id) => await db('detail_guru').insert({ guru_id })

const updateDetailGuru = async (id_guru, req) => {
    return await db('detail_guru').where('guru_id', id_guru).update(req)
}

module.exports = {
    insertDetailGuru,
    updateDetailGuru
};
