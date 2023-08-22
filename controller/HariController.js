const db = require('./../Config')
const response = require('./../Response')
const moment = require('../utilities/moment')
const guruUtils = require('../utilities/GuruUtils')

const hari = async (req, res) => {
    const hari = await db('hari').join('guru', 'hari.piket', '=', 'guru.id_guru').select('id_hari', 'nama_hari', 'masuk', 'pulang', 'jampel', 'piket', 'status', 'nama_guru')
    return response(200, hari, `Berhasil get data hari!`, res)
}

const updateHari = async (req, res) => {
    let { id_hari, nama_hari, masuk, pulang, jampel, piket, status } = req.body
    masuk = moment(masuk, 'HH:mm:ss').format('HH:mm:ss')
    pulang = moment(pulang, 'HH:mm:ss').format('HH:mm:ss')
    jampel = moment(jampel, 'HH:mm:ss').format('HH:mm:ss')
    if (!id_hari || !nama_hari || !masuk || !piket) {
        return response(400, null, `Gagal! semua data wajib diisi`, res);
    }    
    if (!moment(masuk, 'HH:mm:ss', true).isValid()) return response(400, null, `Gagal! data masuk harus format waktu`, res)
    if (!moment(pulang, 'HH:mm:ss', true).isValid()) return response(400, null, `Gagal! data pulang harus format waktu`, res)
    if (!moment(jampel, 'HH:mm:ss', true).isValid()) return response(400, null, `Gagal! data jampel harus format waktu`, res)
    if (await guruUtils.existingGuru(piket) === null) return response(400, null, `Guru piket tidak terdaftar!`, res)

    const updateHari = await db('hari').where('id_hari', id_hari).update({
        nama_hari, masuk, piket, status
    })

    return response(201, {}, `Berhasil edit hari!`, res)
}

module.exports = { hari, updateHari }