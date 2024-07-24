const db = require('../Config')
const Moment = require('./../utilities/Moment')

const getAllNavland = async (trx = db) => await trx('navland')

const insertNavland = async (req, trx = db) => await trx('navland').insert(req)

const updateNavland = async (id_navland, req, trx = db) => await trx('navland').where('id_navland', id_navland).update(req)

const deleteNavland = async (id_navland, trx = db) => await trx('navland').where('id_navland', id_navland).del()

module.exports = {
    getAllNavland,
    insertNavland,
    updateNavland,
    deleteNavland
};
