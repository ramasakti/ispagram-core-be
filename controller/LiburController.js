const db = require('./../Config')
const response = require('./../Response')
const moment = require('../utilities/moment')

const libur = async (req, res) => {
    const libur = await db('libur').select()
    const dataLibur = libur.map(item => {
        return {
            id_libur: item.id_libur,
            keterangan: item.keterangan,
            mulai: moment(item.mulai).format('YYYY-MM-DD'),
            sampai: moment(item.sampai).format('YYYY-MM-DD')
        }
    })
    return response(200, dataLibur, `Berhasil get data libur!`, res)
}

const storeLibur = async (req, res) => {
    const { keterangan, mulai, sampai } = req.body
    if (!keterangan || !mulai || !sampai) return response(400, null, `Gagal! Semua field wajib diisi`, res)
    if (!moment(mulai, 'YYYY-MM-DD', true).isValid()) return response(400, null, `Gagal! data mulai harus format waktu`, res)
    if (!moment(sampai, 'YYYY-MM-DD', true).isValid()) return response(400, null, `Gagal! data mulai harus format waktu`, res)

    const storeLibur = await db('libur').insert({
        keterangan, mulai, sampai
    })
    return response(201, {}, `Berhasil menambahkan data libur!`, res)
}

const updateLibur = async (req, res) => {
    const { id_libur, keterangan, mulai, sampai } = req.body
    if (!id_libur) return response(400, null, `Gagal! data libur tidak ditemukan`, res)
    if (!moment(mulai, 'YYYY-MM-DD', true).isValid()) return response(400, null, `Gagal! data mulai harus format waktu`, res)
    if (!moment(sampai, 'YYYY-MM-DD', true).isValid()) return response(400, null, `Gagal! data mulai harus format waktu`, res)
    const updateLibur = await db('libur').where('id_libur', id_libur).update({
        keterangan, mulai, sampai
    })
    return response(201, {}, `Berhasil mengubah data libur!`, res)
}

const deleteLibur = async (req, res) => {
    const id_libur = req.params.id_libur
    const dataLibur = await db('libur').where('id_libur', id_libur).first()
    if (!dataLibur) return response(400, null, `Gagal! Data libur tidak ditemukan`, res)

    const deleteLibur = await db('libur').where('id_libur', id_libur).del()
    return response(201, {}, `Berhasil delete data libur!`, res)
}

module.exports = { libur, storeLibur, updateLibur, deleteLibur }