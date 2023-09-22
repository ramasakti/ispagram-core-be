const db = require('./../Config')
const response = require('./../Response')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const sendMail = require('./../utilities/UserUtils')
const moment = require('../utilities/moment')
const UserUtils = require('../utilities/UserUtils')

const users = async (req, res) => {
    const users = await db('user').where('username', '!=', 'adminabsen').select('username', 'name', 'email', 'avatar', 'role')
    return response(200, users, `Data Users`, res)
}

const detailUser = async (req, res) => {
    const detailUser = await db('user').where('username', req.params.username).first()
    if (!detailUser) return response(400, null, `User tidak terdaftar!`, res)

    if (detailUser.role === 'Guru') {
        const piket = await db('hari').where('nama_hari', moment().format('dddd')).where('piket', detailUser.username).first()
        const walas = await db('kelas').where('walas', detailUser.username).first()
        if (piket) {
            const dataUser = {
                username: detailUser.username,
                name: detailUser.name,
                email: detailUser.email,
                avatar: detailUser.avatar,
                role: 'Piket',
            }

            if (walas) {
                dataUser.walas = true
                dataUser.kelas_id = walas.id_kelas
            }

            return response(200, dataUser, 'Authenticated', res)
        }
        if (walas) {
            const dataUser = {
                username: detailUser.username,
                name: detailUser.name,
                email: detailUser.email,
                avatar: detailUser.avatar,
                role: 'Walas',
                walas: true,
                kelas_id: walas.id_kelas
            }
            return response(200, dataUser, 'Authenticated', res)
        }
    }

    delete detailUser.password
    return response(200, detailUser, `Detail User ${detailUser.username}`, res)
}

const updateUser = async (req, res) => {
    const { email, role } = req.body
    const username = req.params.username
    const detailUser = await db('user').where('username', username).first()
    if (!detailUser) return response(400, null, `User tidak terdaftar!`, res)

    if (detailUser.email != email) {
        const existingEmail = await UserUtils.existingEmail(email)
        if (existingEmail != null) return response(400, null, `Email telah digunakan!`, res)
    }

    if (req.file) {
        if (!req.file.mimetype.startsWith('image/')) {
            return response(400, null, `File yang diunggah bukan gambar!`, res)
        }

        await db('user').where('username', username).update({ avatar: req.file.path })
    }

    await db('user').where('username', username).update({
        email, role
    })

    return response(201, {}, `Berhasil update user!`, res)
}

const forgetPassword = async (req, res) => {
    const { email } = req.body
    const detailUser = await db('user').where('email', email).first()
    if (!detailUser) return response(400, null, `Email tidak terdaftar!`, res)
    const randomPassword = crypto.randomBytes(Math.ceil(8 / 2)).toString('hex').slice(0, 8)
    await db('user').where('email', email).update('password', await bcrypt.hash(randomPassword, 10))
    const text = `Assalamualaikum Yth. Bapak/Ibu ${detailUser.name}\n\nSesuai dengan permintaah Bapak/Ibu perihal reset password, berikut adalah detail akun yang digunakan untuk login di aplikasi Ispagram\nUsername: ${detailUser.username}\nPassword: ${randomPassword}\n\nNote: Segera ganti password anda agar mudah diingat`
    sendMail.credentialInfo(email, `Informasi Reset Password`, text)
    return response(200, null, `Berhasil reset password! Cek kotak masuk email untuk mengetahui password baru anda!`, res)
}

module.exports = { users, detailUser, updateUser, forgetPassword }