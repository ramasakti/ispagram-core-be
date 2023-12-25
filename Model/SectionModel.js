const db = require('../Config')

const getAllSection = async () => await db('section').orderBy('order', 'ASC')

const getSectionByID = async (id_section) => await db('section').where('id_section', id_section).first()

const createSection = async (req) => await db('section').insert(req)

const updateSection = async (id_section, req) => await db('section').where('id_section', id_section).update(req)

const deleteSection = async (id_section) => await db('section').where('id_section', id_section).del()

module.exports = {
    getAllSection,
    getSectionByID,
    createSection,
    updateSection,
    deleteSection
};
