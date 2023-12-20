const db = require('../Config')
const response = require('../Response')
const moment = require('../Utilities/Moment')
const SiswaModel = require('../Model/SiswaModel')
const KelasModel = require('../Model/KelasModel')
const UserModel = require('../Model/UserModel')
const AbsenSiswaModel = require('../Model/AbsenSiswaModel')
const DetailSiswaModel = require('../Model/DetailSiswaModel')
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
    try {
        const { id_siswa, rfid, nama_siswa, kelas_id, alamat, telp, tempat_lahir, tanggal_lahir } = req.body

        if (!id_siswa || !nama_siswa || !kelas_id || !alamat || !tempat_lahir || !tanggal_lahir) {
            return response(400, null, 'Semua data siswa harus diisi!', res)
        }

        const existingSiswa = await SiswaModel.getDetailSiswaByID(id_siswa)
        if (existingSiswa) return response(409, null, 'ID siswa sudah ada dalam database!', res)

        if (!moment(tanggal_lahir, 'YYYY-MM-DD', true).isValid()) {
            return response(400, null, 'Tanggal lahir tidak valid! Format harus YYYY-MM-DD', res)
        }

        await UserModel.insertUser({
            username: id_siswa,
            password: '',
            email: `${id_siswa}@smaispa.sch.id`,
            role: 7
        })

        await SiswaModel.insertSiswa({
            id_siswa, rfid, nama_siswa, kelas_id, alamat, telp, tempat_lahir, tanggal_lahir
        })

        await AbsenSiswaModel.insertAbsen(id_siswa)

        const detailSiswa = await DetailSiswaModel.getDetailSiswaByID(id_siswa)
        if (!detailSiswa) {
            await DetailSiswaModel.insertDetailSiswa(id_siswa)
        }

        return response(201, {}, 'Berhasil menambahkan data siswa!', res)
    } catch (error) {
        console.error('Error storing data:', error)
        return response(500, null, 'Internal Server Error!', res)
    }
}

const update = async (req, res) => {
    try {
        const id_siswa = req.params.id_siswa
        const { rfid, nama_siswa, kelas_id, alamat, telp, tempat_lahir, tanggal_lahir } = req.body
        if (!id_siswa || !rfid || !nama_siswa || !kelas_id || !alamat || !tempat_lahir || !tanggal_lahir) {
            return response(400, null, 'Semua data siswa harus diisi!', res)
        }

        const detailSiswa = await SiswaModel.getSiswaByID(id_siswa)
        if (!detailSiswa) return response(400, null, `ID siswa tidak terdaftar! Data siswa tidak ditemukan!`, res)

        const tanggalLahirFormatted = moment(tanggal_lahir).format("YYYY-MM-DD")
        if (!moment(tanggalLahirFormatted, 'YYYY-MM-DD', true).isValid()) {
            return response(400, null, 'Tanggal lahir tidak valid! Format harus YYYY-MM-DD', res)
        }

        await SiswaModel.updateSiswaByID(id_siswa, {
            rfid,
            nama_siswa,
            kelas_id,
            alamat,
            telp,
            tempat_lahir,
            tanggal_lahir: tanggalLahirFormatted
        })

        return response(201, {}, 'Berhasil update data siswa!', res)
    } catch (error) {
        console.error('Error storing data:', error)
        return response(500, null, 'Internal Server Error!', res)
    }
}

const destroy = async (req, res) => {
    try {
        const id_siswa = req.params.id_siswa

        const detailSiswa = SiswaModel.getSiswaByID(id_siswa)
        if (!detailSiswa) return response(400, null, `ID siswa tidak terdaftar! Data siswa tidak ditemukan!`, res)
        
        await SiswaModel.deleteSiswa(id_siswa)
        
        await UserModel.deleteUserByUsername(id_siswa)

        return response(201, {}, 'Berhasil delete siswa!', res)
    } catch (error) {
        console.error('Error storing data:', error)
        return response(500, null, 'Internal Server Error!', res)
    }
}

const importSiswa = async (req, res) => {
    try {
        if (!req.file) return response(400, null, `No file uploaded!`, res)

        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.load(req.file.buffer)
        const worksheet = workbook.getWorksheet(1)
        const rows = worksheet.getSheetValues()

        const data = rows.slice(1).map(row => ({
            id_siswa: row[1],
            rfid: row[2],
            email: row[3],
            nama_siswa: row[4],
            kelas_id: row[5],
            alamat: row[6],
            telp: row[7],
            tempat_lahir: row[8],
            tanggal_lahir: row[9]
        }))

        const kelas = await KelasModel.getAllKelas()
        const existingSiswaID = await SiswaModel.getAllIDSiswa()

        const filteredData = data.map(row => {
            const rowIDSiswa = row.id_siswa

            if (existingSiswaID.includes(rowIDSiswa)) {
                return response(400, null, `Data siswa ${rowIDSiswa} already exists!`, res)
            } else if (!kelas.find(kelasData => kelasData.id_kelas === row.kelas_id)) {
                return response(400, null, `Data kelas tidak valid!`, res)
            } else {
                return row
            }
        })

        const trxProvider = db.transactionProvider()
        const trx = await trxProvider()

        try {
            for (const siswa of filteredData) {
                await trx('users').insert({
                    username: siswa.id_siswa,
                    password: await bcrypt.hash(siswa.id_siswa.toString(), 10),
                    email: siswa.email,
                    role: 7
                })

                await trx('siswa').insert({
                    id_siswa: siswa.id_siswa,
                    rfid: siswa.rfid,
                    nama_siswa: siswa.nama_siswa,
                    kelas_id: siswa.kelas_id,
                    alamat: siswa.alamat,
                    telp: siswa.telp,
                    tempat_lahir: siswa.tempat_lahir,
                    tanggal_lahir: siswa.tanggal_lahir,
                })

                await trx('absen').insert({ id_siswa: siswa.id_siswa })
                
                await trx('detail_siswa').insert({ siswa_id: siswa.id_siswa })
            }

            await trx.commit()
        } catch (error) {
            await trx.rollback()
            console.error(error)
            return response(400, null, `Gagal import siswa!`, res)
        }
        
        return response(200, null, `Berhasil import siswa!`, res)
    }
    catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

module.exports = { siswa, siswaKelas, detail, store, update, destroy, importSiswa }