const db = require('../Config')
const response = require('../Response')
const moment = require('../Utilities/Moment')
const LiburModel = require('../Model/LiburModel')

const libur = async (req, res) => {
    try {
        const libur = await LiburModel.getAllLibur()
        const dataLibur = libur.map(item => {
            return {
                id_libur: item.id_libur,
                keterangan: item.keterangan,
                mulai: moment(item.mulai).format('YYYY-MM-DD'),
                sampai: moment(item.sampai).format('YYYY-MM-DD')
            }
        })
        return response(200, dataLibur, `Berhasil get data libur!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error`, res)
    }
}

const storeLibur = async (req, res) => {
    try {
        const { keterangan, libur } = req.body
        if (!keterangan || !libur) return response(400, null, `Gagal! Semua field wajib diisi`, res)
    
        if (libur.length === 10) {
            await LiburModel.insertLibur({
                keterangan, mulai: libur, sampai: libur
            })
        } else {
            const mulai = libur.substring(0, 10)
            const sampai = libur.substring(14, 24)
    
            await LiburModel.insertLibur({
                keterangan, mulai, sampai
            })
        }
    
        return response(201, {}, `Berhasil menambahkan data libur!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error`, res)
    }
}

const updateLibur = async (req, res) => {
    try {
        const { id_libur, keterangan, libur } = req.body
        if (!id_libur) return response(400, null, `Gagal! data libur tidak ditemukan`, res)
    
        if (!libur && keterangan) {
            await LiburModel.updateLibur(id_libur, { keterangan })
    
            return response(201, {}, `Berhasil mengubah data libur!`, res)
        }
    
        if (libur.length === 10) {
            await LiburModel.updateLibur(id_libur, {
                keterangan, mulai: libur, sampai: libur
            })
        } else {
            const mulai = libur.substring(0, 10)
            const sampai = libur.substring(14, 24)
    
            await LiburModel.updateLibur(id_libur, {
                keterangan, mulai, sampai
            })
        }
        
        return response(201, {}, `Berhasil mengubah data libur!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error`, res)
    }
}

const deleteLibur = async (req, res) => {
    try {
        const id_libur = req.params.id_libur
        const dataLibur = await LiburModel.getLiburByID(id_libur)
        if (!dataLibur) return response(400, null, `Gagal! Data libur tidak ditemukan`, res)
    
        await LiburModel.deleteLibur(id_libur)
        return response(201, {}, `Berhasil delete data libur!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error`, res)
    }
}

module.exports = { libur, storeLibur, updateLibur, deleteLibur }