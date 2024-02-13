const db = require('../Config')
const moment = require('../utilities/Moment')

const getAbsenStafByDate = async (start, end) => {
    return await db('absen_staf')
        .join('guru', 'guru.id_guru', '=', 'absen_staf.guru_id')
        .whereBetween('absen_staf.tanggal', [start, end])
}

const insertAbsenStaf = async (req) => await db('absen_staf').insert(req)

const getAbsenNowByGuru = async (id_guru) => {
    return await db('absen_staf')
        .where('tanggal', moment().format('YYYY-MM-DD'))
        .where('guru_id', id_guru)
        .first()
}

module.exports = {
    getAbsenStafByDate,
    insertAbsenStaf,
    getAbsenNowByGuru
};
