const moment = require('../utilities/Moment')

const getAbsenStafByDate = async (start, end, trx) => {
    return await trx('absen_staf')
        .join('guru', 'guru.id_guru', '=', 'absen_staf.guru_id')
        .whereBetween('absen_staf.tanggal', [start, end])
}

const insertAbsenStaf = async (req, trx) => await trx('absen_staf').insert(req)

const getAbsenNowByGuru = async (id_guru, trx) => {
    return await trx('absen_staf')
        .where('tanggal', moment().format('YYYY-MM-DD'))
        .where('guru_id', id_guru)
        .first()
}

module.exports = {
    getAbsenStafByDate,
    insertAbsenStaf,
    getAbsenNowByGuru
};
