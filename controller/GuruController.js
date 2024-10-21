const response = require('../Response')
const moment = require('../utilities/Moment')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const GuruModel = require('../Model/GuruModel')
const UserModel = require('../Model/UserModel')
const DetailGuruModel = require('../Model/DetailGuruModel')

const guru = async (req, res) => {
    try {
        const guru = await GuruModel.getAllGuru(req.db)

        const dataGuru = guru.map(item => {
            return {
                id_guru: item.id_guru,
                staf: item.staf,
                rfid: item.rfid,
                nama_guru: item.nama_guru,
                alamat: item.alamat,
                telp: item.telp,
                tempat_lahir: item.tempat_lahir,
                tanggal_lahir: moment(item.tanggal_lahir).format('YYYY-MM-DD')
            }
        })

        return response(200, dataGuru, `Data Guru`, res);
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const dataStaf = async (req, res) => {
    try {
        const staf = await GuruModel.getAllGuruStaf(req.db)
        return response(200, staf, `Data Staf`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const store = async (req, res) => {
    try {
        // Tangkap inputan
        const { id_guru, staf, email, rfid, nama_guru, alamat, telp, tempat_lahir, tanggal_lahir } = req.body

        // Filter apakah inputan lengkap
        if (!id_guru || !email || !nama_guru || !telp) return response(400, null, `Formulir yang dikirim tidak lengkap!`, res)

        // Periksa apakah ID sudah digunakan
        const existingGuru = await GuruModel.getGuruByID(id_guru, req.db)
        if (existingGuru != null) return response(400, null, `ID guru telah digunakan!`, res)

        // Periksa apakah email sudah digunakan
        const existingEmail = await UserModel.getUserByEmail(email, req.db)
        if (existingEmail != null) return response(400, null, `Email telah digunakan!`, res)

        // Buatkan random password
        const randomPassword = crypto.randomBytes(Math.ceil(8 / 2)).toString('hex').slice(0, 8)

        // Masukkan ke tabel users
        await UserModel.insertUser({
            username: id_guru,
            password: await bcrypt.hash(randomPassword, 10),
            email,
            role: 6
        }, req.db)

        // Insert ke tabel guru
        await GuruModel.insertGuru({
            id_guru, staf: staf ?? false, rfid, nama_guru, alamat, telp, tempat_lahir, tanggal_lahir
        }, req.db)

        // Cek tabel detail_guru
        const detail_guru = await GuruModel.getDetailGuruByID(id_guru, req.db)
        // Insert ke tabel detail_guru
        if (!detail_guru) await DetailGuruModel.insertDetailGuru(id_guru, req.db)

        // Teks yang akan dikirim ke email yang didaftarkan
        const text = `Assalamualaikum ${nama_guru} \n\n Berikut adalah detail akun yang digunakan untuk login di aplikasi Ispagram \n Username: ${id_guru} \n Password: ${randomPassword} \n\n Note: Segera ganti password anda agar mudah diingat`

        // Kirim email
        UserUtils.credentialInfo(email, `Informasi Kredensial Login`, text)

        return response(201, {}, `Berhasil menambah data guru baru`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const update = async (req, res) => {
    try {
        const id_guru = req.params.id_guru
        // Tangkap inputan
        const { staf, rfid, email, nama_guru, alamat, telp, tempat_lahir, tanggal_lahir } = req.body
        if (!nama_guru || !alamat || !telp || !tempat_lahir || !tanggal_lahir) {
            return response(400, null, `Formulir yang dikirim tidak lengkap!`, res)
        }

        // Periksa apakah ID guru terdaftar
        const existingGuru = await GuruModel.getGuruAndUserInfoByID(id_guru, req.db)
        if (!existingGuru) return response(400, null, `ID guru tidak terdaftar!`, res)

        // Periksa apakah guru pernah terdaftar
        const detailGuru = await GuruModel.getDetailGuruByID(id_guru, req.db)
        if (!detailGuru) await DetailGuruModel.insertDetailGuru(id_guru, req.db)

        // Periksa apakah email sudah digunakan
        if (email) {
            const existingEmail =  await UserModel.getUserByEmail(email, req.db)
            if (existingEmail != null && existingEmail.email !== detailGuru.email) return response(400, null, `Email telah digunakan!`, res)
        }

        // Update ke database
        await GuruModel.updateGuru(id_guru, {
            rfid, nama_guru, alamat, telp, tempat_lahir, tanggal_lahir, staf
        }, req.db)

        return response(201, {}, `Berhasil update data guru!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const destroy = async (req, res) => {
    try {
        // Tangkap id guru dari parameter
        const id_guru = req.params.id_guru

        // Periksa apakah id guru terdaftar
        const detailGuru = GuruModel.getDetailGuruByID(id_guru, req.db)
        if (!detailGuru) return response(400, null, `ID guru tidak terdaftar!`, res)

        // Delete dari tabel guru
        await GuruModel.deleteGuru(id_guru, req.db)

        // Delete dari tabel users
        await UserModel.deleteUserByUsername(id_guru, req.db)

        return response(201, {}, `Berhasil delete guru`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

module.exports = { guru, dataStaf, store, update, destroy }