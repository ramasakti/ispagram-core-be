const response = require('../Response')
const moment = require('../utilities/Moment')
const guruUtils = require('../utilities/GuruUtils')
const HariModel = require('../Model/HariModel')

const hari = async (req, res) => {
    try {
        const hari = await HariModel.getAllHariWithPiket(req.db)
        return response(200, hari, `Berhasil get data hari!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const detail = async (req, res) => {
    try {
        const id_hari = req.params.id_hari
        const detail = await HariModel.getAllJamKhususByHariID(id_hari, req.db)

        return response(200, detail, `Data Jam Khusus`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const updateHari = async (req, res) => {
    try {
        const id_hari = req.params.id_hari
        // Tangkap inputan
        let { nama_hari, masuk, pulang, jampel, piket, status, khusus } = req.body
        console.log(khusus)

        if (khusus.length > 0) {
            khusus.map(async item => {
                console.log(item)
                await HariModel.upsertJamKhusus({
                    id: item.id,
                    hari_id: id_hari,
                    keterangan: item.keterangan,
                    mulai: item.mulai,
                    selesai: item.selesai
                }, req.db)
            })
        }

        masuk = moment(masuk, 'HH:mm:ss').format('HH:mm:ss')
        pulang = moment(pulang, 'HH:mm:ss').format('HH:mm:ss')
        jampel = moment(jampel, 'HH:mm:ss').format('HH:mm:ss')

        // Filter inputan
        if (!id_hari || !nama_hari || !masuk || !piket) return response(400, null, `Gagal! semua data wajib diisi`, res);

        // Filter format waktu
        if (!moment(masuk, 'HH:mm:ss', true).isValid()) return response(400, null, `Gagal! data masuk harus format waktu`, res)
        if (!moment(pulang, 'HH:mm:ss', true).isValid()) return response(400, null, `Gagal! data pulang harus format waktu`, res)
        if (!moment(jampel, 'HH:mm:ss', true).isValid()) return response(400, null, `Gagal! data jampel harus format waktu`, res)

        // Update hari
        await HariModel.updateHariByID(id_hari, {
            nama_hari, masuk, jampel, piket, status
        }, req.db)

        return response(201, {}, `Berhasil edit hari!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const updateJamKhusus = async (req, res) => {
    try {
        const id = req.params.id
        const { keterangan, mulai, selesai } = req.body[0]
        if (!keterangan || !mulai || !selesai) return response(400, null, `Semua Form Wajib Diisi!`, res)
        await HariModel.upsertJamKhusus({
            id, keterangan, mulai, selesai
        }, req.db)

        return response(201, {}, `Berhasil update jam khusus!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

module.exports = { hari, detail, updateHari, updateJamKhusus }