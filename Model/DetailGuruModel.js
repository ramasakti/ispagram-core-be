const db = require('../Config')

const insertDetailGuru = async (guru_id, trx = db) => await trx('detail_guru').insert({ guru_id })

const updateDetailGuru = async (id_guru, req, trx = db) => {
    return await trx('detail_guru').where('guru_id', id_guru).update(req)
}

module.exports = {
    insertDetailGuru,
    updateDetailGuru
};
