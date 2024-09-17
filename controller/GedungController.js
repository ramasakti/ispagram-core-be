const response = require('../Response')
const GedungModel = require('../Model/GedungModel')

const gedung = async (req, res) => {
    try {
        const gedung = await GedungModel.getAllGedung(req.db)

        return response(200, gedung, `Data Gedung`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const store = async (req, res) => {
    try {
        const nama_gedung = req.body.nama_gedung
        if (!nama_gedung) return response(400, null, `Semua Form Wajib Diisi!`, res)

        await GedungModel.insertGedung({ nama_gedung })
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const update = async (req, res) => {
    try {
        const id_gedung = req.params.id_gedung
        const nama_gedung = req.body.nama_gedung
        if (!id_gedung || !nama_gedung) return response(400, null, `Semua Form Wajib Diisi!`, res)

        await GedungModel.updateGedungByID(id_gedung, { nama_gedung }, req.db)
        return response(201, {}, `Berhasil Tambah Gedung!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const destroy = async (req, res) => {
    try {
        const id_gedung = req.params.id_gedung
        if (!id_gedung) return response(400, null, `Semua Form Wajib Diisi!`, res)

        await GedungModel.deleteGedungByID(id_gedung, req.db)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

module.exports = {
    gedung,
    store,
    update,
    destroy
};
