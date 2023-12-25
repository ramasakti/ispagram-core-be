const db = require('../Config')
const moment = require('../utilities/Moment')

const getAllLibur = async () => await db('libur')

const getAllComingLibur = async () => await db('libur').where('tanggal', '<', moment().format('YYYY-MM-DD'))

const getLiburByID = async (id_libur) => await db('libur').where('id_libur', id_libur).first()

const insertLibur = async (req) => await db('libur').insert(req)

const updateLibur = async (id_libur, req) => await db('libur').where('id_libur', id_libur).update(req)

const deleteLibur = async (id_libur) => await db('libur').where('id_libur', id_libur).del()

module.exports = {
    getAllLibur,
    getAllComingLibur,
    getLiburByID,
    insertLibur,
    updateLibur,
    deleteLibur
};
