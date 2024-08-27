const getAllSection = async (trx) => await trx('section').orderBy('order', 'ASC')

const getSectionByID = async (id_section, trx) => await trx('section').where('id_section', id_section).first()

const createSection = async (req, trx) => await trx('section').insert(req)

const updateSection = async (id_section, req, trx) => await trx('section').where('id_section', id_section).update(req)

const deleteSection = async (id_section, trx) => await trx('section').where('id_section', id_section).del()

module.exports = {
    getAllSection,
    getSectionByID,
    createSection,
    updateSection,
    deleteSection
};
