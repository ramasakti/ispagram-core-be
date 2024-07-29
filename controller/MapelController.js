const db = require('../Config')
const response = require('../Response')
const MapelModel = require('../Model/MapelModel')
const ExcelJS = require('exceljs')

const mapel = async (req, res) => {
    try {
        const mapel = await MapelModel.getAllMapelWithKelas()
        return response(200, mapel, ``, res)
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal Server Error!`, res)
    }
}

const store = async (req, res) => {
    try {
        const { nama_mapel, kelas_id } = req.body
        if (!nama_mapel || !kelas_id) return response(400, null, `Semua Form Wajib Diisi!`, res)

        await MapelModel.insertMapel({ nama_mapel, kelas_id })

        return response(200, mapel, ``, res)
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal Server Error!`, res)
    }
}

const update = async (req, res) => {
    try {
        const id_mapel = req.params.id_mapel
        const { nama_mapel, kelas_id } = req.body
        if (!id_mapel || !nama_mapel || !kelas_id) return response(400, null, `Semua Form Wajib Diisi!`, res)

        await MapelModel.updateMapel(id_mapel, { nama_mapel, kelas_id })

        return response(201, mapel, ``, res)
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal Server Error!`, res)
    }
}

const destroy = async (req, res) => {
    try {
        const mapel = await MapelModel.getMapelByID(req.params.id_mapel)
        console.log(req.params.id_mapel, mapel)
        if (!mapel) return response(404, null, `Mapel tidak ditemukan!`, res)

        await MapelModel.deleteMapel(req.params.id_mapel)

        return response(201, {}, ``, res)
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal Server Error!`, res)
    }
}

const mapelByKelas = async (req, res) => {
    try {
        const kelas_id = req.params.kelas_id
        const mapel = await MapelModel.getAllMapelWithKelasByKelas(kelas_id)

        if (!mapel) return response(404, null, `Data Kosong!`, res)

        return response(200, mapel, `Data Mapel Kelas`, res)
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal Server Error!`, res)
    }
}

const importMapel = async (req, res) => {
    const trx = await db.transaction();
    try {
        if (!req.file) return response(400, null, `No file uploaded!`, res);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(req.file.buffer);
        const worksheet = workbook.getWorksheet(1);
        const rows = worksheet.getSheetValues();

        const data = rows.slice(2).map(row => ({
            nama_mapel: row[1],
            kelas_id: row[2],
        }));

        for (const mapel of data) {
            await MapelModel.insertMapel({
                nama_mapel: mapel.nama_mapel,
                kelas_id: mapel.kelas_id
            })
        }

        return response(201, {}, `Berhasil Import Mapel`, res)
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal Server Error!`, res)
    }
}

module.exports = {
    mapel,
    store,
    update,
    destroy,
    mapelByKelas,
    importMapel
};