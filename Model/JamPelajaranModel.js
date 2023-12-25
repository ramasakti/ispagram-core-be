const db = require('../Config')

const getAllJampel = async () => await db('jam_pelajaran')

const getJampelByHari = async (hari) => {
    return await db('jam_pelajaran').where('hari', hari).first()
}