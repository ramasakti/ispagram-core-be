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

        const existingUsername = await UserModel.getUserByUsername(username, trx)
        const existingEmail = await UserModel.getUserByEmail(email, trx)
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

        await AbsenSiswaModel.insertAbsen({ id_siswa }, trx)

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

        if (!id_siswa || !rfid || !nama_siswa || !kelas_id || !alamat || !tempat_lahir || !tanggal_lahir) {
            return response(400, null, 'Semua data siswa harus diisi!', res)
        }

        if (!Moment(tanggal_lahir, 'YYYY-MM-DD', true).isValid()) throw new Error('Tanggal lahir tidak valid! Format harus YYYY-MM-DD')

        const existingDetailSiswa = await SiswaModel.getDetailSiswaByID(id_siswa, trx)
        if (existingDetailSiswa) throw new Error(`ID telah pernah digunakan oleh ${existingDetailSiswa.nama_siswa}`)

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

        const existingKelasID = await KelasModel.getAllKelas()
        const existingSiswaID = await SiswaModel.getAllIDSiswa()
        const siswaRole = await RoleModel.getRoleByRole('Siswa')

        const filteredData = data.map(row => {
            if (existingSiswaID.includes(row.id_siswa)) {
                return response(400, null, `Data siswa ${row.id_siswa} already exists!`, res)
            } else if (!existingKelasID.find(kelas => kelas.id_kelas === row.kelas_id)) {
                return response(400, null, `Data kelas tidak valid!`, res)
            } else {
                return row
            }
        })

        const trx = await db.transaction()

        try {
            for (const siswa of filteredData) {
                await UserModel.insertUser({
                    username: siswa.id_siswa,
                    password: await bcrypt.hash(siswa.id_siswa.toString(), 10),
                    email: siswa.email,
                    role: siswaRole.id_role
                }, trx)

                await SiswaModel.insertSiswa({
                    id_siswa: siswa.id_siswa,
                    rfid: siswa.rfid,
                    kelas_id: siswa.kelas_id
                }, trx)

                await SiswaModel.insertDetailSiswa({
                    id_siswa: siswa.id_siswa,
                    nama_siswa: siswa.nama_siswa,
                    telp: siswa.telp,
                    alamat: siswa.alamat,
                    tempat_lahir: siswa.tempat_lahir,
                    tanggal_lahir: siswa.tanggal_lahir
                }, trx)

                await AbsenSiswaModel.insertAbsen(siswa.id_siswa , trx)
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