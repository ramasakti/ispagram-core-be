const getAllGedung = async (trx) => await trx('gedung')

const insertGedung = async (req, trx) => await trx('gedung').insert(req)

const updateGedungByID = async (id_gedung, req, trx) => await trx('gedung').where('id_gedung', id_gedung).update(req)

const deleteGedungByID = async (id_gedung, trx) => await trx('gedung').where('id_gedung', id_gedung).del()

module.exports = {
    getAllGedung,
    insertGedung,
    updateGedungByID,
    deleteGedungByID
};
