const response = require('../Response')
const moment = require('../Utilities/Moment')
const guruUtils = require('../Utilities/GuruUtils')
const HariModel = require('../Model/HariModel')

const hari = async (req, res) => {
    try {
        const hari = await HariModel.getAllHariWithPiket()
        return response(200, hari, `Berhasil get data hari!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const updateHari = async (req, res) => {
    try {
        const id_hari = req.params.id_hari
        // Tangkap inputan
        let { nama_hari, diniyah, jam_diniyah, masuk, istirahat, pulang, jampel, piket, status } = req.body

        // Ubah format waktu
        jam_diniyah.mulai = moment(jam_diniyah.mulai, 'HH:mm:ss').format('HH:mm:ss')
        jam_diniyah.sampai = moment(jam_diniyah.sampai, 'HH:mm:ss').format('HH:mm:ss')
        masuk = moment(masuk, 'HH:mm:ss').format('HH:mm:ss')
        pulang = moment(pulang, 'HH:mm:ss').format('HH:mm:ss')
        jampel = moment(jampel, 'HH:mm:ss').format('HH:mm:ss')

        // Filter inputan
        if (!id_hari || !nama_hari || !masuk || !piket) return response(400, null, `Gagal! semua data wajib diisi`, res);

        // Filter format waktu
        if (!moment(masuk, 'HH:mm:ss', true).isValid()) return response(400, null, `Gagal! data masuk harus format waktu`, res)
        if (!moment(pulang, 'HH:mm:ss', true).isValid()) return response(400, null, `Gagal! data pulang harus format waktu`, res)
        if (!moment(jampel, 'HH:mm:ss', true).isValid()) return response(400, null, `Gagal! data jampel harus format waktu`, res)

        // Cek apakah ID guru terdaftar
        if (await guruUtils.existingGuru(piket) === null) return response(400, null, `Guru piket tidak terdaftar!`, res)

        // Update hari
        await HariModel.updateHariByID(id_hari, {
            nama_hari, diniyah, jam_diniyah, masuk, istirahat, piket, status
        })

        return response(201, {}, `Berhasil edit hari!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

module.exports = { hari, updateHari }