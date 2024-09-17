const response = require('../Response')
const InventarisModel = require('../Model/inventarisModel')

const inventaris = async (req, res) => {
    try {
        const inventaris = await InventarisModel.getAllInventaris(req.body)

        return response(200, inventaris, `Data Inventaris`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const inventarisRuang = async (req, res) => {
    try {
        const id_ruang = req.params.id_ruang
        if (!id_ruang) return response(404, null, `Ruang tidak ditemukan!`, res)

        const inventaris = await InventarisModel.getAllInventarisByRuang(id_ruang, req.db)
        return response(200, inventaris, ``, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const store = async (req, res) => {
    try {
        const { kode_inventaris, nama_inventaris, tahun, ruang } = req.body
        if (!kode_inventaris || !nama_inventaris || !tahun || !ruang) return response(400, null, `Semua form wajib disi!`, res)

        await InventarisModel.insertInventaris({
            kode_inventaris, nama_inventaris, tahun, ruang_id: ruang
        }, req.db)

        return response(201, {}, `Berhasil tambah inventaris!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const update = async (req, res) => {
    try {
        const id_inventaris = req.params.id_inventaris
        if (!id_inventaris) return response(400, null, `Inventaris tidak ditemukan!`, res)


        const { kode_inventaris, nama_inventaris, tahun, ruang } = req.body
        if (!kode_inventaris || !nama_inventaris || !tahun || !ruang) return response(400, null, `Semua form wajib disi!`, res)

        console.log(kode_inventaris, nama_inventaris, tahun, ruang)
        await InventarisModel.updateInventarisByID(id_inventaris, {
            kode_inventaris, nama_inventaris, tahun, ruang_id: ruang
        }, req.db)

        return response(201, {}, ``, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const destroy = async (req, res) => {
    try {
        const id_inventaris = req.params.id_inventaris
        if (!id_inventaris) return response(400, null, `Inventaris tidak ditemukan!`, res)

        await InventarisModel.deleteInventarisByID(id_inventaris, req.db)

        return response(201, {}, ``, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

module.exports = {
    inventaris,
    inventarisRuang,
    store,
    update,
    destroy
};
