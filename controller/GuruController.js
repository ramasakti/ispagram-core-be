const db = require('./../Config')
const response = require('./../Response')
const moment = require('../utilities/moment')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const sendMail = require('./../utilities/UserUtils')
const GuruUtils = require('./../utilities/GuruUtils')

const guru = async (req, res) => {
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
}

const storeGuru = async (req, res) => {
    const { id_guru, email, rfid, nama_guru, alamat, telp, tempat_lahir, tanggal_lahir } = req.body
    if (!id_guru || !email || !nama_guru || !telp) return response(400, null, `Formulir yang dikirim tidak lengkap!`, res)
    const existingGuru = await GuruUtils.existingGuru(id_guru)
    if (existingGuru != null) return response(400, null, `ID guru telah digunakan`, res)
    const storeGuru = await db('guru').insert({
        id_guru, rfid, nama_guru, alamat, telp, tempat_lahir, tanggal_lahir
    })
    const randomPassword = crypto.randomBytes(Math.ceil(8 / 2)).toString('hex').slice(0, 8)
    const text = `Assalamualaikum Yth. Bapak/Ibu ${nama_guru} \n\n Berikut adalah detail akun yang digunakan untuk login di aplikasi Ispagram \n Username: ${id_guru} \n Password: ${randomPassword} \n\n Note: Segera ganti password anda agar mudah diingat`
    sendMail.credentialInfo(email, `Informasi Kredensial Login`, text)
    await db('user').insert({
        username: id_guru,
        password: await bcrypt.hash(randomPassword, 10),
        name: nama_guru,
        email,
        role: 'Guru'
    })
    return response(201, {}, `Berhasil menambah data guru baru`, res)
}

const updateGuru = async (req, res) => {
    const { id_guru, rfid, nama_guru, alamat, telp, tempat_lahir, tanggal_lahir } = req.body
    const detailGuru = await db('guru').where('id_guru', id_guru).first()
    if (!detailGuru) return response(400, null, `ID guru tidak terdaftar!`, res)
    const updateGuru = await db('guru').where('id_guru', id_guru).update({
        rfid, nama_guru, alamat, telp, tempat_lahir, tanggal_lahir
    })
    return response(201, {}, `Berhasil update data guru baru!`, res)
}

const deleteGuru = async (req, res) => {
    const id_guru = req.params.id_guru
    const detailGuru = await db('guru').where('id_guru', id_guru).first()
    if (!detailGuru) return response(400, null, `ID guru tidak terdaftar!`, res)
    await db('guru').where('id_guru', id_guru).del()
    await db('user').where('username', id_guru).del()
    return response(201, {}, `Berhasil delete guru`, res)
}

module.exports = { guru, storeGuru, updateGuru, deleteGuru }