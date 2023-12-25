const response = require('../Response')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const sendMail = require('../utilities/UserUtils')
const moment = require('../utilities/Moment')
const UserModel = require('../Model/UserModel')
const HariModel = require('../Model/HariModel')
const KelasModel = require('../Model/KelasModel')
const UserUtils = require('../utilities/UserUtils')

const users = async (req, res) => {
    try {
        const users = await UserModel.getAllUsersWithRole()        
        return response(200, users, `Data Users`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const detail = async (req, res) => {
    const username = req.params.username

    const detailUser = await UserModel.getUserWithGuruByUsername(username)
    if (!detailUser) return response(400, null, `User tidak terdaftar!`, res)

    if (detailUser.role === 'Guru') {
        const piket = await HariModel.getHariByHariAndPiket(moment().format('dddd'), piket)
        const walas = await KelasModel.getKelasByWalas(detailUser.username)
        
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

const update = async (req, res) => {
    try {
        const { email, passwordLama, passwordBaru, id_role } = req.body
        const username = req.params.username

        const detailUser = await UserModel.getUserWithRoleByUsername(username)
        if (!detailUser) return response(400, null, `User tidak terdaftar!`, res)
    
        if (detailUser.email != email) {
            const existingEmail = await UserUtils.existingEmail(email)
            if (existingEmail != null) return response(400, null, `Email telah digunakan!`, res)
        }
    
        if (req.file) {
            const avatar = req.file.path
            if (!req.file.mimetype.startsWith('image/')) {
                return response(400, null, `File yang diunggah bukan gambar!`, res)
            }
    
            await UserModel.updateUserAvatarByUsername(username, avatar)
        }
    
        if (passwordLama) {
            const isPasswordValid = await bcrypt.compareSync(passwordLama, detailUser.password)
    
            if (isPasswordValid) {
                await UserModel.updateUserPasswordByUsername(username, await bcrypt.hash(passwordBaru, 10))
            }else{
                return response(400, null, `Password salah!`, res)
            }
        }
    
        await UserModel.updateUserByUsername(username, { email, role: id_role })
    
        return response(201, {}, `Berhasil update user!`, res)
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal Server Error!`, res)
    }
}

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body
        const detailUser = await UserModel.getUserWithGuruByEmail(email)
        if (!detailUser) return response(400, null, `Email tidak terdaftar!`, res)

        const randomPassword = crypto.randomBytes(Math.ceil(8 / 2)).toString('hex').slice(0, 8)
        await UserModel.updateUserPasswordByEmail(email, randomPassword)

        const text = `Assalamualaikum Warahmatullahi Wabarakatuh! ${detailUser.name}\n\nSesuai dengan permintaan anda perihal reset password, berikut adalah detail akun yang digunakan untuk login di aplikasi Ispagram\nUsername: ${detailUser.username}\nPassword: ${randomPassword}\n\nNote: Segera ganti password anda agar mudah diingat`
        sendMail.credentialInfo(email, `Informasi Reset Password`, text)

        return response(200, null, `Berhasil reset password! Cek kotak masuk email untuk mengetahui password baru anda!`, res)
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal Server Error!`, res)
    }
}

const store = async (req, res) => {
    try {
        const { username, password, email, avatar, role } = req.body
        if (!username || !password || !email || !role) return response(400, null, `Gagal! Semua form wajib diisi!`, res)

        await UserModel.insertUser({
            username, password, email, avatar, role
        })

        return response(201, {}, `Berhasil tambah user!`, res)
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal Server Error!`, res)
    }
}

module.exports = { users, detail, update, store, forgetPassword }