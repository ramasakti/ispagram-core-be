const db = require('./../Config')
const response = require('./../Response')
const moment = require('../utilities/moment')
const existingHari = require('../utilities/HariUtils')

const jamPelajaran = async (req, res) => {
    const jamPelajaran = await db('jam_pelajaran').select()
    return response(200, jamPelajaran, `Berhasil get data jam pelajaran!`, res)
}

const storeJampel = async (req, res) => {
    const { hari, keterangan, mulai, selesai } = req.body
    if (!hari || !keterangan || !mulai || !selesai) return response(400, null, `Semua field wajib diisi!`, res)
    if (await existingHari.existingHari(hari) === null) return response(400, mull, `Format hari tidak sesuai!`, res)

    try {
        const result = await db('jam_pelajaran')
            .where(function (query) {
                query
                    .whereBetween('mulai', [mulai, selesai])
                    .orWhereBetween('selesai', [mulai, selesai])
            })
            .where('hari', hari)

        if (result.length < 1) {
            await db('jam_pelajaran').insert({
                hari: hari,
                keterangan: keterangan,
                mulai: mulai,
                selesai: selesai + ':59',
            })

            return response(201, {}, `Berhasil menambah jam pelajaran baru!`, res)
        } else {
            return response(400, null, `Gagal! jam pelajaran berbenturan`, res)
        }
    }
    catch (error) {
        return response(500, null, `Internal server error!`, res)
    }
}

const updateJampel = async (req, res) => {
    const { mulai, selesai, hari, keterangan, id_jampel } = req.body
    if (!hari || !keterangan || !mulai || !selesai) return response(400, null, `Semua field wajib diisi!`, res)
    if (await existingHari.existingHari(hari) === null) return response(400, mull, `Format hari tidak sesuai!`, res)

    try {
        const result = await db('jam_pelajaran')
            .where(function (query) {
                query
                    .whereBetween('mulai', [mulai, selesai])
                    .orWhereBetween('selesai', [mulai, selesai])
            })
            .where('hari', hari)

        const existingHari = await db('jam_pelajaran')
            .where('id_jampel', id_jampel)
            .select('hari')
            .first()

        if (result.length < 1 || existingHari.hari === hari) {
            await db('jam_pelajaran')
                .where('id_jampel', id_jampel)
                .update({
                    hari, keterangan, mulai, selesai
                })

            return response(201, {}, `Berhasil update jam pelajaran!`, res)
        } else {
            return response(400, null, `Gagal! Jam berbentrokan!`, res)
        }
    } catch (error) {
        return response(500, null, `Internal server error!`, res)
    }
}

const deleteJampel = async (req, res) => {
    const id_jampel = req.params.id_jampel
    const jampel = await db('jam_pelajaran').where('id_jampel', id_jampel).first()
    if (!jampel) return response(400, null, `Gagal! Jam pelajaran tidak ditemukan`, res)

    const deleteJampel = await db('jam_pelajaran').where('id_jampel', id_jampel).del()
    return response(201, null, `Berhasil hapus jam pelajaran`, res)
}

module.exports = { jamPelajaran, storeJampel, updateJampel, deleteJampel }