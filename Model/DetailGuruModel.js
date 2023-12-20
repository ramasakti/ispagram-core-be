const db = require('../Config')

const insertDetailGuru = async (id_guru) => await db('detail_guru').insert({ guru_id: id_guru })

module.exports = {
    insertDetailGuru,
    
};
