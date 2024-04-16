const response = require('../Response')
const AbsenStafModel = require('./../Model/AbsenStafModel')

const rekap = async (req, res) => {
    try {
        const { range } = req.query
        if (!range) return response(400, null, `Form tidak lengkap!`, res)

        const tanggalArray = range.split(' to ')
        if (tanggalArray.length < 2) tanggalArray.push(tanggalArray[0])

        const dari = tanggalArray[0]
        const sampai = tanggalArray[1]

        const rekap = await AbsenStafModel.getAbsenStafByDate(dari, sampai)
        return response(200, rekap, `Rekap Absen Staf dari ${dari} sampai ${sampai}`, res);
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const store = async (req, res) => {
    try {
        const id_guru = req.params.id_guru
        const keterangan = req.body.keterangan

        const absen = await AbsenStafModel.getAbsenNowByGuru(id_guru)
        if (absen) return response(400, null, `Sudah Absen!`, res)

        await AbsenStafModel.insertAbsenStaf({
            guru_id: id_guru, 
            tanggal: moment().format('YYYY-MM-DD'),
            waktu: moment().format('HH:MM:SS'),
            keterangan
        })
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const update = async (req, res) => {
    try {
        return response(202, {}, `Berhasil hapus!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const destroy = async (req, res) => {
    try {
        return response(202, {}, `Berhasil hapus!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

module.exports = {
    rekap,
    store,
    update,
    destroy
};
