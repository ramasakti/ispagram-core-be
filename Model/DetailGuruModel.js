const db = require('../Config')

const insertDetailGuru = async (id_guru) => await db('detail_guru').insert({ guru_id: id_guru })

const updateDetailGuru = async (id_guru, req) => {
    return await db('detail_guru').where('guru_id', id_guru).update(req)
}

module.exports = {
    insertDetailGuru,
    updateDetailGuru
};
