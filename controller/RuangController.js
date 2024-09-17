const response = require('../Response')
const RuangModel = require('../Model/RuangModel')

const ruang = async (req, res) => {
    try {
        const ruang = await RuangModel.getAllRuang(req.db)

        return response(200, ruang, `Data Ruang`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error`, res)
    }
}

const store = async (req, res) => {
    try {
        const { kode_ruang, nama_ruang, lantai, gedung } = req.body
        if (!kode_ruang || !nama_ruang || !lantai || !gedung) return response(400, null, `Semua Form Wajib Diisi!`, res)

        await RuangModel.insertRuang({
            kode_ruang, nama_ruang, lantai, gedung
        }, req.db)

        return response(201, {}, `Berhasil Tambah Ruang!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error`, res)
    }
}

const update = async (req, res) => {
    try {
        const id_ruang = req.params.id_ruang
        if (!id_ruang) return response(404, null, `Ruang Tidak Ditemukan!`, res)
            
        const { kode_ruang, nama_ruang, lantai, gedung } = req.body
        if (!kode_ruang || !nama_ruang || !lantai || !gedung) return response(400, null, `Semua Form Wajib Diisi!`, res)

        return response(201, {}, `Berhasil Update Data Ruang!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error`, res)
    }
}

const destroy = async (req, res) => {
    try {
        const id_ruang = req.params.id_ruang
        if (!id_ruang) return response(404, null, `Ruang Tidak Ditemukan!`, res)
            
        await RuangModel.deleteRuangByID(id_ruang, req.db)

        return response(201, {}, `Berhasil Delete Ruang!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error`, res)
    }
}

module.exports = {
    ruang,
    store,
    update,
    destroy
};
