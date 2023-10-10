const db = require('./../Config')
const response = require('./../Response')
const moment = require('../utilities/moment')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const UserUtils = require('./../utilities/UserUtils')
const GuruUtils = require('./../utilities/GuruUtils')

const guru = async (req, res) => {
    try {
        // Ambil data guru kemudian kembalikan tanggal lahir dengan format Y-m-d 
        // Hal ini dilakukan karena jika langsung dikembalikan dari database formatnya tidak sesuai
        const guru = await db('guru').select()
        const dataGuru = guru.map(item => {
            return {
                id_guru: item.id_guru,
                rfid: item.rfid,
                nama_guru: item.nama_guru,
                alamat: item.alamat,
                telp: item.telp,
                tempat_lahir: item.tempat_lahir,
                tanggal_lahir: moment(item.tanggal_lahir).format('YYYY-MM-DD')
            }
        })

        return response(200, dataGuru, `Data Guru`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const storeGuru = async (req, res) => {
    try {
        // Tangkap inputan
        const { id_guru, email, rfid, nama_guru, alamat, telp, tempat_lahir, tanggal_lahir } = req.body
        
        // Filter apakah inputan lengkap
        if (!id_guru || !email || !nama_guru || !telp) return response(400, null, `Formulir yang dikirim tidak lengkap!`, res)
    
        // Periksa apakah ID sudah digunakan
        const existingGuru = await GuruUtils.existingGuru(id_guru)
        if (existingGuru != null) return response(400, null, `ID guru telah digunakan!`, res)
    
        // Periksa apakah email sudah digunakan
        const existingEmail = await UserUtils.existingEmail(email)
        if (existingEmail != null) return response(400, null, `Email telah digunakan!`, res)
    
        // Insert ke tabel guru
        const storeGuru = await db('guru').insert({
            id_guru, rfid, nama_guru, alamat, telp, tempat_lahir, tanggal_lahir
        })
    
        // Buatkan random password
        const randomPassword = crypto.randomBytes(Math.ceil(8 / 2)).toString('hex').slice(0, 8)
    
        // Teks yang akan dikirim ke email yang didaftarkan
        const text = `Assalamualaikum Yth. Bapak/Ibu ${nama_guru} \n\n Berikut adalah detail akun yang digunakan untuk login di aplikasi Ispagram \n Username: ${id_guru} \n Password: ${randomPassword} \n\n Note: Segera ganti password anda agar mudah diingat`
        
        // Kirim email
        UserUtils.credentialInfo(email, `Informasi Kredensial Login`, text)
    
        // Masukkan ke tabel user
        await db('user').insert({
            username: id_guru,
            password: await bcrypt.hash(randomPassword, 10),
            name: nama_guru,
            email,
            role: 'Guru'
        })
        
        return response(201, {}, `Berhasil menambah data guru baru`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const updateGuru = async (req, res) => {
    try {
        // Tangkap inputan
        const { id_guru, rfid, nama_guru, alamat, telp, tempat_lahir, tanggal_lahir } = req.body
    
        // Periksa apakah ID guru terdaftar
        const detailGuru = await db('guru').where('id_guru', id_guru).first()
        if (!detailGuru) return response(400, null, `ID guru tidak terdaftar!`, res)
    
        // Periksa apakah email sudah digunakan
        const existingEmail = await UserUtils.existingEmail(email)
        if (existingEmail != null) return response(400, null, `Email telah digunakan!`, res)
    
        // Update ke database
        const updateGuru = await db('guru').where('id_guru', id_guru).update({
            rfid, nama_guru, alamat, telp, tempat_lahir, tanggal_lahir
        })
    
        return response(201, {}, `Berhasil update data guru baru!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const deleteGuru = async (req, res) => {
    try {
        // Tangkap id guru dari parameter
        const id_guru = req.params.id_guru
    
        // Periksa apakah id guru terdaftar
        const detailGuru = await db('guru').where('id_guru', id_guru).first()
        if (!detailGuru) return response(400, null, `ID guru tidak terdaftar!`, res)
    
        // Delete dari tabel guru
        await db('guru').where('id_guru', id_guru).del()
    
        // Delete dari tabel user
        await db('user').where('username', id_guru).del()
    
        return response(201, {}, `Berhasil delete guru`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

module.exports = { guru, storeGuru, updateGuru, deleteGuru }