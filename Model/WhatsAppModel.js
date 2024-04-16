const db = require('../Config')

const getAllWhatsApp = async (trx = db) => await trx('whatsapp')

const getPrimaryWhatsApp = async (trx = db) => await trx('whatsapp').where('id_whatsapp', 1).first()

const createWhatsApp = async (req, trx = db) => await trx('whatsapp').insert(req)

const updateWhatsApp = async (id_whatsapp, req, trx = db) => await trx('whatsapp').where('id_whatsapp', id_whatsapp).update(req)

const deleteWhatsApp = async (id_whatsapp, trx = db) => await trx('whatsapp').where('id_whatsapp', id_whatsapp).delete()

const updateConnectivity = async (id_whatsapp, connectivity, trx = db) => await trx('whatsapp').where('id_whatsapp', id_whatsapp).update({ connected : connectivity })

module.exports = {
    getAllWhatsApp,
    getPrimaryWhatsApp,
    createWhatsApp,
    updateWhatsApp,
    deleteWhatsApp,
    updateConnectivity
};
