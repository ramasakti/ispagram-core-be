const moment = require('../utilities/Moment')

const getAllLibur = async (trx) => await trx('libur').orderBy('mulai', 'asc')

const getAllComingLibur = async (trx) => await trx('libur').where('mulai', '<', moment().format('YYYY-MM-DD'))

const getLiburByID = async (id_libur, trx) => await trx('libur').where('id_libur', id_libur).first()

const insertLibur = async (req, trx) => await trx('libur').insert(req)

const updateLibur = async (id_libur, req, trx) => await trx('libur').where('id_libur', id_libur).update(req)

const deleteLibur = async (id_libur, trx) => await trx('libur').where('id_libur', id_libur).del()

module.exports = {
    getAllLibur,
    getAllComingLibur,
    getLiburByID,
    insertLibur,
    updateLibur,
    deleteLibur
};
