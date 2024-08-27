const getAllWhatsApp = async (trx) => await trx('whatsapp')

const getPrimaryWhatsApp = async (trx) => await trx('whatsapp').where('id_whatsapp', 1).first()

const createWhatsApp = async (req, trx) => await trx('whatsapp').insert(req)

const updateWhatsApp = async (id_whatsapp, req, trx) => await trx('whatsapp').where('id_whatsapp', id_whatsapp).update(req)

const deleteWhatsApp = async (id_whatsapp, trx) => await trx('whatsapp').where('id_whatsapp', id_whatsapp).delete()

const updateConnectivity = async (id_whatsapp, connectivity, trx) => await trx('whatsapp').where('id_whatsapp', id_whatsapp).update({ connected : connectivity })

module.exports = {
    getAllWhatsApp,
    getPrimaryWhatsApp,
    createWhatsApp,
    updateWhatsApp,
    deleteWhatsApp,
    updateConnectivity
};
