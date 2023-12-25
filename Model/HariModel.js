const db = require('../Config')

const getAllHari = async () => await db('hari')

const getAllHariActive = async () => await db('hari').where('status', 1)

const getAllHariWithPiket = async () => await db('hari').join('guru', 'guru.id_guru', '=', 'hari.piket')

const getHariByPiket = async (piket) => await db('hari').where('piket', piket).first()

const getHariByHari = async (hari) => await db('hari').where('nama_hari', hari).first()

const getHariWithPiketByPiket = async (piket) => {
    return await db('hari')
        .join('guru', 'guru.id_guru', '=', 'hari.piket')    
        .where('hari.piket', piket)
        .first()
}

const getHariWithPiketByHari = async (hari) => {
    return await db('hari')
        .join('guru', 'guru.id_guru', '=', 'hari.piket')    
        .where('hari.nama_hari', hari)
        .first()
}

const getHariByHariAndPiket = async (hari, piket) => {
    return await db('hari')
        .where('nama_hari', hari)
        .where('piket', piket)
        .first()
}

const updateHariByID = async (id_hari, req) => {
    return await db('hari').where('id_hari', id_hari).update(req)
}

const updateHariByHari = async (hari, req) => {
    return await db('hari').where('nama_hari', hari).update(req)
}

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
    updateHariByHari
};
