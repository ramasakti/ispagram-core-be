const db = require('../Config')
const response = require('../Response')
const AlumniModel = require('../Model/AlumniModel')
const RoleModel = require('../Model/RoleModel')
const SiswaModel = require('../Model/SiswaModel')
const UserModel = require('../Model/UserModel')
const bcrypt = require('bcryptjs')
const ExcelJS = require('exceljs')

const alumni = async (req, res) => {
    try {
        const alumni = await AlumniModel.getAllAlumni()

        return response(200, alumni, `Data Alumni`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const importAlumni = async (req, res) => {
    try {
        if (!req.file) return response(400, null, `No file uploaded!`, res);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(req.file.buffer);
        const worksheet = workbook.getWorksheet(1);
        const rows = worksheet.getSheetValues();

        const data = rows.slice(1).map(row => ({
            id_siswa: row[1],
            nisn: row[4],
            nik: row[7],
            nama_siswa: row[3],
            alamat: row[8],
            telp: row[9],
            tempat_lahir: row[5],
            tanggal_lahir: row[6],
            tahun_lulus: row[2]
        }));

        const trx = await db.transaction();

        try {
            for (const alumni of data) {
                await SiswaModel.insertDetailSiswa({
                    id_siswa: alumni.id_siswa,
                    nisn: alumni.nisn,
                    nik: alumni.nik ?? '',
                    nama_siswa: alumni.nama_siswa,
                    telp: alumni.telp ?? '',
                    alamat: alumni.alamat,
                    tempat_lahir: alumni.tempat_lahir,
                    tanggal_lahir: alumni.tanggal_lahir
                }, trx);
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
}

module.exports = {
    alumni,
    importAlumni
};
