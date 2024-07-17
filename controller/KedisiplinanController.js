const db = require('../Config')
const response = require('../Response')
const KedisiplinanModel = require('../Model/KedisiplinanModel');

const kedisiplinan = async (req, res) => {
    try {
        const { range, kelas } = req.query
        if (!kelas || !range || range === 'undefined') return response(400, null, 'Form tidak lengkap!', res)

        const tanggalArray = range.split(' to ')
        if (tanggalArray.length < 2) tanggalArray.push(tanggalArray[0])

        const dari = tanggalArray[0]
        const sampai = tanggalArray[1]

        const kedisiplinan = await KedisiplinanModel.getKedisiplinanByDateRangeAndKelas(kelas, dari, sampai)
        console.log(kedisiplinan);

        return response(200, kedisiplinan, ``, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const store = async (req, res) => {
    try {
        const { siswa_id, point, tanggal } = req.body
        if (!siswa_id || !point) return response(400, null, `Semua Form Wajib Diisi!`, res)

        await KedisiplinanModel.insertKedisiplinan({
            siswa_id, point, tanggal
        })

        return response(201, {}, ``, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const update = async (req, res) => {
    try {
        const id_kedisiplinan = req.params.id_kedisiplinan

        await KedisiplinanModel.updateKedisiplinan(id_kedisiplinan, {
            siswa_id, point, tanggal
        })

        return response(201, {}, ``, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const destroy = async (req, res) => {
    try {
        const id_kedisiplinan = req.params.id_kedisiplinan

        await KedisiplinanModel.deleteKedisiplinan(id_kedisiplinan)

        return response(201, {}, ``, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

module.exports = {
    kedisiplinan,
    store,
    update,
    destroy
};
