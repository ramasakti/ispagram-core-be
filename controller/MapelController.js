const db = require('../Config')
const response = require('../Response')
const MapelModel = require('../Model/MapelModel')
const KelasModel = require('../Model/KelasModel')
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
            nama_mapel: row[2],
            kelas_id: row[4],
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

const template = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    const kelas = await KelasModel.getAllKelas();

    const options = kelas.map(option => `${option.tingkat} ${option.jurusan}`).join(',');

    const validation = {
        type: 'list',
        allowBlank: true,
        formulae: [`"${options}"`]
    };

    worksheet.getCell('A1').value = 'No.';
    worksheet.getCell('B1').value = 'Nama Mapel';
    worksheet.getCell('C1').value = 'Kelas';
    worksheet.getCell('D1').value = 'ID Kelas';

    // Tambahkan worksheet untuk menyimpan data kelas
    const dataKelasSheet = workbook.addWorksheet('DataKelas');
    dataKelasSheet.state = 'hidden';

    kelas.forEach((kls, index) => {
        dataKelasSheet.getCell(`A${index + 2}`).value = `${kls.tingkat} ${kls.jurusan}`;
        dataKelasSheet.getCell(`B${index + 2}`).value = kls.id_kelas;
    });

    for (let i = 2; i <= 500; i++) {
        worksheet.getCell(`C${i}`).dataValidation = validation;
        worksheet.getCell(`D${i}`).value = { formula: `VLOOKUP(C${i},'DataKelas'!A:B,2,FALSE)` };
    }

    worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
        row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
            cell.protection = { locked: true };
        });
    });

    for (let row = 2; row <= 500; row++) {
        worksheet.getCell(`A${row}`).protection = { locked: false };
        worksheet.getCell(`B${row}`).protection = { locked: false };
        worksheet.getCell(`C${row}`).protection = { locked: false };
    }

    worksheet.protect('parlaungan1980', {
        selectLockedCells: true,
        selectUnlockedCells: true
    });

    worksheet.getColumn('A').width = 5;
    worksheet.getColumn('B').width = 50;
    worksheet.getColumn('C').width = 30;
    worksheet.getColumn('D').width = 15;

    const borderStyle = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };

    for (let row = 1; row <= 500; row++) {
        worksheet.getCell(`A${row}`).border = borderStyle;
        worksheet.getCell(`B${row}`).border = borderStyle;
        worksheet.getCell(`C${row}`).border = borderStyle;
        worksheet.getCell(`D${row}`).border = borderStyle;
    }

    return workbook;
};

const downloadTemplate = async (req, res) => {
    try {
        const workbook = await template();

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Template Excel Import Mapel.xlsx');

        await workbook.xlsx.write(res);

        res.end();
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
    importMapel,
    downloadTemplate
};