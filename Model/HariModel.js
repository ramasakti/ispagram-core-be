const db = require('../Config')

const getAllHari = async (trx) => await trx('hari')

const getAllHariActive = async (trx) => await trx('hari').where('status', 1)

const getAllHariWithPiket = async (trx) => await trx('hari').join('guru', 'guru.id_guru', '=', 'hari.piket')

const getHariByPiket = async (piket, trx) => await trx('hari').where('piket', piket).first()

const getHariByHari = async (hari, trx) => await trx('hari').where('nama_hari', hari).first()

const getHariWithPiketByPiket = async (piket, trx) => {
    return await trx('hari')
        .join('guru', 'guru.id_guru', '=', 'hari.piket')    
        .where('hari.piket', piket)
        .first()
}

const getHariWithPiketByHari = async (hari, trx) => {
    return await trx('hari')
        .join('guru', 'guru.id_guru', '=', 'hari.piket')    
        .where('hari.nama_hari', hari)
        .first()
}

const getHariByHariAndPiket = async (hari, piket, trx) => {
    return await trx('hari')
        .where('nama_hari', hari)
        .where('piket', piket)
        .first()
}

const updateHariByID = async (id_hari, req, trx) => await trx('hari').where('id_hari', id_hari).update(req)

const updateHariByHari = async (hari, req, trx) => await trx('hari').where('nama_hari', hari).update(req)

const getAllJamKhususByHariID = async (hari_id, trx) => await trx('jam_khusus').where('hari_id', hari_id)

const upsertJamKhusus = async (req, trx) => await trx('jam_khusus').insert(req).onConflict(req).merge()

module.exports = {
    getAllHari,
    getAllHariWithPiket,
    getAllHariActive,
    getHariByPiket,
    getHariByHari,
    getHariWithPiketByPiket,
    getHariWithPiketByHari,
    getHariByHariAndPiket,
    updateHariByID,
    updateHariByHari,
    getAllJamKhususByHariID,
    upsertJamKhusus
};
