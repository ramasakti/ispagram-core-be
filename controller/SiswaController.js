const db = require('../Config')
const response = require('../Response')
const Moment = require('../utilities/Moment')
const SiswaModel = require('../Model/SiswaModel')
const KelasModel = require('../Model/KelasModel')
const UserModel = require('../Model/UserModel')
const RoleModel = require('../Model/RoleModel')
const AbsenSiswaModel = require('../Model/AbsenSiswaModel')
const bcrypt = require('bcryptjs')
const ExcelJS = require('exceljs')

const siswa = async (req, res) => {
    try {
        const dataSiswa = await SiswaModel.getAllSiswa()
        return response(200, dataSiswa, 'Get Data Siswa', res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const siswaKelas = async (req, res) => {
    try {
        const id_kelas = req.params.kelas_id
        const siswaKelas = await SiswaModel.getSiswaByKelas(id_kelas)
        return response(200, siswaKelas, `Data Siswa Kelas`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const detail = async (req, res) => {
    try {
        const id_siswa = req.params.id_siswa
        const detailSiswa = await SiswaModel.getDetailSiswaByID(id_siswa)

        if (!detailSiswa) return response(400, null, `ID siswa tidak terdaftar! Data siswa tidak ditemukan!`, res)

        return response(200, detailSiswa, 'Get Detail Siswa', res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const store = async (req, res) => {
    const trx = await db.transaction()
    try {
        const { id_siswa, rfid, nama_siswa, kelas_id, alamat, telp, tempat_lahir, tanggal_lahir } = req.body

        if (!id_siswa || !nama_siswa || !kelas_id || !alamat || !tempat_lahir || !tanggal_lahir) {
            return response(400, null, 'Semua data siswa harus diisi!', res)
        }

        const existingSiswa = await SiswaModel.getSiswaByID(id_siswa, trx)
        if (existingSiswa) throw new Error(`ID siswa ${existingSiswa.id_siswa} sudah ada dalam database!`)

        if (!Moment(tanggal_lahir, 'YYYY-MM-DD', true).isValid()) throw new Error('Tanggal lahir tidak valid! Format harus YYYY-MM-DD')

        const existingDetailSiswa = await SiswaModel.getDetailSiswaByID(id_siswa, trx)
        if (existingDetailSiswa) throw new Error(`ID telah pernah digunakan oleh ${existingDetailSiswa.nama_siswa}`)

        const existingUsername = await UserModel.getUserByUsername(id_siswa, trx)
        const existingEmail = await UserModel.getUserByEmail(`${id_siswa}@smaispa.sch.id`, trx)
        if (existingUsername || existingEmail) throw new Error(`Username atau email telah digunakan`)

        await SiswaModel.insertDetailSiswa({
            id_siswa, nama_siswa, telp, alamat, tempat_lahir, tanggal_lahir
        }, trx)

        await UserModel.insertUser({
            username: id_siswa,
            password: '',
            email: `${id_siswa}@smaispa.sch.id`,
            role: 7
        }, trx)

        await SiswaModel.insertSiswa({
            id_siswa, rfid, kelas_id
        }, trx)

        await AbsenSiswaModel.insertAbsen(id_siswa, trx)

        await trx.commit()

        return response(201, {}, 'Berhasil menambahkan data siswa!', res)
    } catch (error) {
        await trx.rollback()
        console.error('Error storing data:', error)
        return response(500, null, `${error}`, res)
    }
}

const update = async (req, res) => {
    const trx = await db.transaction()
    try {
        const id_siswa = req.params.id_siswa
        const { rfid, nama_siswa, kelas_id, alamat, telp, tempat_lahir, tanggal_lahir } = req.body
        const tanggalLahirFormatted = Moment(tanggal_lahir).format('YYYY-MM-DD')

        if (!id_siswa || !rfid || !nama_siswa || !kelas_id || !alamat || !tempat_lahir || !tanggal_lahir) {
            return response(400, null, 'Semua data siswa harus diisi!', res)
        }

        if (!Moment(tanggalLahirFormatted, 'YYYY-MM-DD', true).isValid()) throw new Error('Tanggal lahir tidak valid! Format harus YYYY-MM-DD')

        await SiswaModel.updateSiswaByID(id_siswa, { rfid, kelas_id }, trx)

        await SiswaModel.updateDetailSiswaByID(id_siswa, {
            nama_siswa,
            alamat,
            telp,
            tempat_lahir,
            tanggal_lahir: tanggalLahirFormatted
        }, trx)

        await trx.commit()

        return response(201, {}, 'Berhasil update data siswa!', res)
    } catch (error) {
        await trx.rollback()
        console.error('Error storing data:', error)
        return response(500, null, 'Internal Server Error!', res)
    }
}

const destroy = async (req, res) => {
    const trx = await db.transaction()
    try {
        const id_siswa = req.params.id_siswa

        const detailSiswa = SiswaModel.getSiswaByID(id_siswa, trx)
        if (!detailSiswa) return response(400, null, `ID siswa tidak terdaftar! Data siswa tidak ditemukan!`, res)

        await SiswaModel.deleteSiswa(id_siswa, trx)

        await UserModel.deleteUserByUsername(id_siswa, trx)

        await trx.commit()

        return response(201, {}, 'Berhasil delete siswa!', res)
    } catch (error) {
        await trx.rollback()
        console.error('Error storing data:', error)
        return response(500, null, 'Internal Server Error!', res)
    }
}

const templateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    const kelas = await KelasModel.getAllKelas();

    // Sheet for kelas data
    const dataKelasSheet = workbook.addWorksheet('DataKelas');
    dataKelasSheet.state = 'hidden';
    kelas.forEach((kls, index) => {
        dataKelasSheet.getCell(`A${index + 2}`).value = `${kls.tingkat} ${kls.jurusan}`;
        dataKelasSheet.getCell(`B${index + 2}`).value = kls.id_kelas;
    });

    // Data validation using range references
    const kelasValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`DataKelas!$A$2:$A$${kelas.length + 1}`]
    };

    for (let i = 2; i <= 1500; i++) {
        worksheet.getCell(`E${i}`).dataValidation = kelasValidation;
        worksheet.getCell(`J${i}`).value = { formula: `VLOOKUP(B${i},'DataKelas'!$A$2:$B$${kelas.length + 1},2,FALSE)` };
    }
    worksheet.getCell('A1').value = 'NIS / ID Siswa';
    worksheet.getCell('B1').value = 'RFID';
    worksheet.getCell('C1').value = 'Email';
    worksheet.getCell('D1').value = 'Nama Siswa';
    worksheet.getCell('E1').value = 'Kelas';
    worksheet.getCell('F1').value = 'Alamat';
    worksheet.getCell('G1').value = 'Telp';
    worksheet.getCell('H1').value = 'Tempat Lahir';
    worksheet.getCell('I1').value = 'Tanggal Lahir';
    worksheet.getCell('J1').value = 'ID Kelas';

    worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
        row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
            cell.protection = { locked: true };
        });
    });

    for (let row = 2; row <= 1500; row++) {
        worksheet.getCell(`A${row}`).protection = { locked: false };
        worksheet.getCell(`B${row}`).protection = { locked: false };
        worksheet.getCell(`C${row}`).protection = { locked: false };
        worksheet.getCell(`D${row}`).protection = { locked: false };
        worksheet.getCell(`E${row}`).protection = { locked: false };
        worksheet.getCell(`F${row}`).protection = { locked: false };
        worksheet.getCell(`G${row}`).protection = { locked: false };
        worksheet.getCell(`H${row}`).protection = { locked: false };
        worksheet.getCell(`I${row}`).protection = { locked: false };
    }

    worksheet.protect('parlaungan1980', {
        selectLockedCells: true,
        selectUnlockedCells: true
    });

    worksheet.getColumn('A').width = 9;
    worksheet.getColumn('B').width = 9;
    worksheet.getColumn('C').width = 25;
    worksheet.getColumn('D').width = 25;
    worksheet.getColumn('E').width = 25;
    worksheet.getColumn('F').width = 100;
    worksheet.getColumn('G').width = 10;
    worksheet.getColumn('H').width = 10;
    worksheet.getColumn('I').width = 10;
    worksheet.getColumn('J').width = 10;

    const borderStyle = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };

    for (let row = 1; row <= 1500; row++) {
        worksheet.getCell(`A${row}`).border = borderStyle;
        worksheet.getCell(`B${row}`).border = borderStyle;
        worksheet.getCell(`C${row}`).border = borderStyle;
        worksheet.getCell(`D${row}`).border = borderStyle;
        worksheet.getCell(`E${row}`).border = borderStyle;
        worksheet.getCell(`F${row}`).border = borderStyle;
        worksheet.getCell(`G${row}`).border = borderStyle;
        worksheet.getCell(`H${row}`).border = borderStyle;
        worksheet.getCell(`I${row}`).border = borderStyle;
        worksheet.getCell(`J${row}`).border = borderStyle;
    }

    return workbook;
}

const exportExcel = async (req, res) => {
    try {
        const workbook = await templateExcel();

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Template Excel Import Jadwal.xlsx');

        await workbook.xlsx.write(res);

        res.end();
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal Server Error!`, res)
    }
}

const importSiswa = async (req, res) => {
    try {
        if (!req.file) return response(400, null, `No file uploaded!`, res);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(req.file.buffer);
        const worksheet = workbook.getWorksheet(1);
        const rows = worksheet.getSheetValues();

        const data = rows.slice(2).map(row => ({
            id_siswa: row[1],
            rfid: row[2],
            email: row[3],
            nama_siswa: row[4],
            kelas_id: row[10],
            alamat: row[6],
            telp: row[7],
            tempat_lahir: row[8],
            tanggal_lahir: row[9]
        }));

        const existingKelasID = await KelasModel.getAllKelas();
        const existingSiswaID = await SiswaModel.getAllIDSiswa();
        const siswaRole = await RoleModel.getRoleByRole('Siswa');

        const filteredData = [];
        for (const row of data) {
            if (existingSiswaID.includes(row.id_siswa)) {
                return response(400, null, `Data siswa ${row.id_siswa} already exists!`, res);
            } else if (!existingKelasID.find(kelas => kelas.id_kelas == row.kelas_id)) {
                console.log(data);
                return response(400, null, `Data kelas tidak valid!`, res);
            } else {
                filteredData.push(row);
            }
        }

        const trx = await db.transaction();

        try {
            for (const siswa of filteredData) {
                await UserModel.insertUser({
                    username: siswa.id_siswa,
                    password: await bcrypt.hash(siswa.id_siswa.toString(), 10),
                    email: siswa.email,
                    role: siswaRole.id_role
                }, trx);

                await SiswaModel.insertSiswa({
                    id_siswa: siswa.id_siswa,
                    rfid: siswa.rfid,
                    kelas_id: siswa.kelas_id
                }, trx);

                await SiswaModel.insertDetailSiswa({
                    id_siswa: siswa.id_siswa,
                    nama_siswa: siswa.nama_siswa,
                    telp: siswa.telp,
                    alamat: siswa.alamat,
                    tempat_lahir: siswa.tempat_lahir,
                    tanggal_lahir: siswa.tanggal_lahir
                }, trx);

                await AbsenSiswaModel.insertAbsen(siswa.id_siswa , trx);
            }

            await trx.commit();
            return response(200, null, `Berhasil import siswa!`, res);
        } catch (error) {
            await trx.rollback();
            console.error(error);
            return response(400, null, `Gagal import siswa!`, res);
        }
    } catch (error) {
        console.error(error);
        return response(500, null, `Internal Server Error!`, res);
    }
};



module.exports = { siswa, siswaKelas, detail, store, update, destroy, importSiswa, exportExcel }