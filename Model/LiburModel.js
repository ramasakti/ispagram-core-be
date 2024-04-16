const db = require('../Config')
const moment = require('../utilities/Moment')

const getAllLibur = async (trx = db) => await trx('libur').orderBy('mulai', 'asc')

const getAllComingLibur = async (trx = db) => await trx('libur').where('mulai', '<', moment().format('YYYY-MM-DD'))

const getLiburByID = async (id_libur, trx = db) => await trx('libur').where('id_libur', id_libur).first()

const insertLibur = async (req, trx = db) => await trx('libur').insert(req)

const updateLibur = async (id_libur, req, trx = db) => await trx('libur').where('id_libur', id_libur).update(req)

const deleteLibur = async (id_libur, trx = db) => await trx('libur').where('id_libur', id_libur).del()

module.exports = {
    getAllLibur,
    getAllComingLibur,
    getLiburByID,
    insertLibur,
    updateLibur,
    deleteLibur
};
