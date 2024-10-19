const db = require('../Config')
const response = require('../Response')
const moment = require('../utilities/Moment')
const jadwalUtils = require('../utilities/JadwalUtils')
const JadwalModel = require('../Model/JadwalModel')
const MapelModel = require('../Model/MapelModel')
const KelasModel = require('../Model/KelasModel')
const JamPelajaranModel = require('../Model/JamPelajaranModel')
const GuruModel = require('../Model/GuruModel')
const ExcelJS = require('exceljs')

const jadwal = async (req, res) => {
    try {
        const jadwalData = await JadwalModel.getFullJadwalByDateNow(moment().format('YYYY-MM-DD'), req.db)
        return response(200, jadwalData, 'Jadwal', res);
    } catch (error) {
        console.error(error);
        return response(500, { message: 'Internal Server Error' }, 'Error', res);
    }
}

const store = async (req, res) => {
    try {
        // Tangkap inputan dan periksa
        const { jampel, guru, mapel, kelas } = req.body
        if (!jampel || !guru || !mapel || !kelas) return response(400, null, `Gagal! Inputan tidak lengkap!`, res)

        // Ambil data mapel untuk mendapatkan detail kelas
        const detailMapel = await MapelModel.getMapelByID(mapel, req.db)

        // Parse jampel menjadi JSON
        const jam_pelajaran = JSON.parse(jampel)

        // Variabel penampung error
        let hasError = false

        // Looping jampel 
        for (const item of jam_pelajaran) {
            // Cek apakah jam sudah digunakan 
            const existingJadwal = await jadwalUtils.existingJadwal(item.value, kelas, req.db)
            if (existingJadwal !== null) {
                hasError = true
                break
            }
        }

        // Jika jampel bentrok
        if (hasError) return response(400, null, `Jam Pelajaran telah digunakan!`, res);

        // Jika tidak ada kesalahan, store ke database
        for (const item of jam_pelajaran) {
            await JadwalModel.insertJadwal({ jampel: item.value, guru_id: guru, kelas_id: kelas, mapel }, req.db)
        }

        return response(201, {}, `Berhasil menambahkan data jadwal!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const update = async (req, res) => {
    try {
        // Tangkap request parameter
        const id_jadwal = req.params.id_jadwal

        // Tangkap inputan dan periksa
        let { jampel, id_guru, kelas_id, mapel } = req.body

        // Periksa apakah inputan lengkap
        if (!jampel || !id_guru || !mapel || !kelas_id) return response(400, null, `Semua inputan wajib diisi!`, res)

        try {
            // Parsing ke JSON ketika ada perubahan jam pelajaran
            jampel = JSON.parse(jampel)

            // Periksa jadwal apakah berbentrokan
            const existingJadwal = await jadwalUtils.existingJadwal(jampel.value, kelas_id, req.db)
            if (existingJadwal !== null) return response(400, null, `Jam Pelajaran telah digunakan!`, res)

            // Update tabel jadwal
            await JadwalModel.updateJadwal(id_jadwal, {
                jampel: jampel.value, guru_id: id_guru, kelas_id, mapel
            }, req.db)
        } catch (error) {
            jampel = req.body.jampel

            // Update tabel jadwal
            await JadwalModel.updateJadwal(id_jadwal, {
                jampel, guru_id: id_guru, kelas_id, mapel
            }, req.db)
        }

        return response(201, {}, `Berhasil update jadwal!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const destroy = async (req, res) => {
    try {
        // Tangkap inputan dari parameter
        const id_jadwal = req.params.id_jadwal

        // Cek apakah jam berbentrokan
        const existingJadwal = await JadwalModel.getJadwalByID(id_jadwal, req.db)

        if (!existingJadwal) return response(400, null, `Jadwal tidak ditemukan!`, res)

        // Insert ke tabel
        await JadwalModel.deleteJadwalByID(id_jadwal, req.db)

        return response(201, {}, `Berhasil delete jadwal`, res)
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal server error!`, res)
    }
}

const jadwalGrup = async (req, res) => {
    try {
        // Tangkap inputan dari parameter
        const id_jadwal = req.params.id_jadwal

        // Cek apakah jam berbentrokan
        const existingJadwal = await JadwalModel.getJadwalWithJampelByIDJadwal(id_jadwal, req.db)
        if (!existingJadwal) return response(400, null, `Jadwal tidak ditemukan!`, res)

        const jadwal = await req.db('jadwal')
            .join('jam_pelajaran', 'jam_pelajaran.id_jampel', '=', 'jadwal.jampel')
            .where('mapel', existingJadwal.mapel)
            .where('kelas_id', existingJadwal.kelas_id)
            .where('guru_id', existingJadwal.guru_id)
            .where('jam_pelajaran.hari', existingJadwal.hari)

        return response(200, jadwal, `Jadwal Grup`, res)
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal server error!`, res)
    }
}

const templateExcel = async (req) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    const kelas = await KelasModel.getAllKelas(req.db);
    const jampel = await JamPelajaranModel.getAllJampelActive(req.db);
    const guru = await GuruModel.getAllGuru(req.db);
    const mapel = await MapelModel.getAllMapel(req.db);

    // Sheet for kelas data
    const dataKelasSheet = workbook.addWorksheet('DataKelas');
    dataKelasSheet.state = 'hidden';
    kelas.forEach((kls, index) => {
        dataKelasSheet.getCell(`A${index + 2}`).value = `${kls.tingkat} ${kls.jurusan}`;
        dataKelasSheet.getCell(`B${index + 2}`).value = kls.id_kelas;
    });

    // Sheet for jampel data
    const dataJampelSheet = workbook.addWorksheet('DataJampel');
    dataJampelSheet.state = 'hidden';
    jampel.forEach((jampel, index) => {
        dataJampelSheet.getCell(`A${index + 2}`).value = `${jampel.keterangan} ${jampel.mulai} - ${jampel.selesai}`;
        dataJampelSheet.getCell(`B${index + 2}`).value = jampel.id_jampel;
    });

    // Sheet for guru data
    const dataGuruSheet = workbook.addWorksheet('DataGuru');
    dataGuruSheet.state = 'hidden';
    guru.forEach((guru, index) => {
        dataGuruSheet.getCell(`A${index + 2}`).value = `${guru.nama_guru}`;
        dataGuruSheet.getCell(`B${index + 2}`).value = guru.id_guru;
    });

    // Sheet for mapel data
    const dataMapelSheet = workbook.addWorksheet('DataMapel');
    dataMapelSheet.state = 'hidden';
    mapel.forEach((mapel, index) => {
        dataMapelSheet.getCell(`A${index + 2}`).value = `${mapel.nama_mapel}`;
        dataMapelSheet.getCell(`B${index + 2}`).value = mapel.id_mapel;
    });

    // Data validation using range references
    const kelasValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`DataKelas!$A$2:$A$${kelas.length + 1}`]
    };

    const jampelValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`DataJampel!$A$2:$A$${jampel.length + 1}`]
    };

    const guruValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`DataGuru!$A$2:$A$${guru.length + 1}`]
    };

    const mapelValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`DataMapel!$A$2:$A$${mapel.length + 1}`]
    };

    worksheet.getCell('A1').value = 'No.';
    worksheet.getCell('B1').value = 'Kelas';
    worksheet.getCell('C1').value = 'Jam Pelajaran';
    worksheet.getCell('D1').value = 'Guru';
    worksheet.getCell('E1').value = 'Mapel';
    worksheet.getCell('F1').value = 'ID Kelas';
    worksheet.getCell('G1').value = 'ID Jam Pelajaran';
    worksheet.getCell('H1').value = 'ID Guru';
    worksheet.getCell('I1').value = 'ID Mapel';

    for (let i = 2; i <= 500; i++) {
        worksheet.getCell(`B${i}`).dataValidation = kelasValidation;
        worksheet.getCell(`F${i}`).value = { formula: `VLOOKUP(B${i},'DataKelas'!$A$2:$B$${kelas.length + 1},2,FALSE)` };

        worksheet.getCell(`C${i}`).dataValidation = jampelValidation;
        worksheet.getCell(`G${i}`).value = { formula: `VLOOKUP(C${i},'DataJampel'!$A$2:$B$${jampel.length + 1},2,FALSE)` };

        worksheet.getCell(`D${i}`).dataValidation = guruValidation;
        worksheet.getCell(`H${i}`).value = { formula: `VLOOKUP(D${i},'DataGuru'!$A$2:$B$${guru.length + 1},2,FALSE)` };

        worksheet.getCell(`E${i}`).dataValidation = mapelValidation;
        worksheet.getCell(`I${i}`).value = { formula: `VLOOKUP(E${i},'DataMapel'!$A$2:$B$${mapel.length + 1},2,FALSE)` };
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
        worksheet.getCell(`D${row}`).protection = { locked: false };
        worksheet.getCell(`E${row}`).protection = { locked: false };
    }

    worksheet.protect('parlaungan1980', {
        selectLockedCells: true,
        selectUnlockedCells: true
    });

    worksheet.getColumn('A').width = 5;
    worksheet.getColumn('B').width = 25;
    worksheet.getColumn('C').width = 35;
    worksheet.getColumn('D').width = 25;
    worksheet.getColumn('E').width = 25;
    worksheet.getColumn('F').width = 10;
    worksheet.getColumn('G').width = 10;
    worksheet.getColumn('H').width = 10;
    worksheet.getColumn('I').width = 10;

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
        worksheet.getCell(`E${row}`).border = borderStyle;
        worksheet.getCell(`F${row}`).border = borderStyle;
        worksheet.getCell(`G${row}`).border = borderStyle;
        worksheet.getCell(`H${row}`).border = borderStyle;
        worksheet.getCell(`I${row}`).border = borderStyle;
    }

    return workbook;
};

const exportExcel = async (req, res) => {
    try {
        const workbook = await templateExcel(req);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Template Excel Import Jadwal.xlsx');

        await workbook.xlsx.write(res);

        res.end();
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal Server Error!`, res)
    }
}

const importExcel = async (req, res) => {
    try {
        if (!req.file) return response(400, null, 'No file uploaded!', res);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(req.file.buffer);
        const worksheet = workbook.getWorksheet(1);

        // Skip header row and get sheet values
        const rows = worksheet.getSheetValues().slice(2);

        // Filter out empty rows
        const data = rows.filter(row => row.length > 1 && row[1] && row[2] && row[3] && row[4] && row[5] && row[6] && row[7] && row[8] && row[9])
            .map(row => ({
                kelas_id: row[6].result,
                jampel: row[7].result,
                guru_id: row[8].result,
                mapel: row[9].result
            }));
        if (data.length === 0) return response(400, null, 'No valid data to import!', res);

        // Get all existing jam pelajaran
        const existingJampel = await JamPelajaranModel.getAllAvailableJampel(req.db);

        // Pisahkan data yang duplikat
        const duplicatedData = data.filter(row => !existingJampel.includes(row.jampel));

        if (duplicatedData.length > 0) {
            // Ambil keterangan dari id_jampel yang duplikat
            const duplicatedIds = duplicatedData.map(row => row.jampel);
            const duplicatedJampel = await JamPelajaranModel.getJampelInID(duplicatedIds, req.db)

            const duplicatedKeterangan = duplicatedJampel.map(jampel => jampel.keterangan).join(', ');
            return response(400, null, `Terdapat jam pelajaran yang telah digunakan: ${duplicatedKeterangan}`, res);
        }

        const trx = await req.db.transaction();

        try {
            // Insert filtered data into database
            for (const element of filteredData) {
                await JadwalModel.insertJadwal({
                    kelas_id: element.kelas_id,
                    jampel: element.jampel,
                    guru_id: element.guru_id,
                    mapel: element.mapel
                }, trx);
            }

            await trx.commit();
            return response(200, null, 'Berhasil import jadwal!', res);
        } catch (error) {
            await trx.rollback();
            console.error(error);
            return response(400, null, 'Gagal import jadwal!', res);
        }
    } catch (error) {
        console.error(error);
        return response(500, null, 'Internal Server Error!', res);
    }
};

const jadwalIndividu = async (req, res) => {
    try {
        const guru = req.params.id_guru
        const jadwal = await JadwalModel.getJadwalByGuru(guru, moment().format('YYYY-MM-DD'), req.db)        

        return response(200, jadwal, ``, res)
    } catch (error) {
        console.error(error)
        return response(500, null, 'Internal Server Error!', res)
    }
}

module.exports = {
    jadwal,
    store,
    update,
    destroy,
    jadwalGrup,
    exportExcel,
    importExcel,
    jadwalIndividu
}