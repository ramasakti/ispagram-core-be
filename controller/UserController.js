const response = require('../Response')
const bcrypt = require('bcryptjs')
const faceapi = require('face-api.js')
const crypto = require('crypto')
const moment = require('../utilities/Moment')
const UserModel = require('../Model/UserModel')
const HariModel = require('../Model/HariModel')
const KelasModel = require('../Model/KelasModel')
const Mailer = require('../utilities/Mailer')
const fs = require('fs')
const { uploadFileToFTP } = require('../utilities/FTP')

const users = async (req, res) => {
    try {
        const users = await UserModel.getAllUsersWithRole(req.db)
        return response(200, users, `Data Users`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const detail = async (req, res) => {
    const username = req.params.username

    const detailUser = await UserModel.getUserWithRoleByUsername(username, req.db)
    if (!detailUser) return response(400, null, `User tidak terdaftar!`, res)

    if (detailUser.role === 'Guru') {
        const piket = await HariModel.getHariByHariAndPiket(moment().format('dddd'), detailUser.username, req.db)
        const walas = await KelasModel.getKelasByWalas(detailUser.username, req.db)

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

        const detailUser = await UserModel.getUserWithRoleByUsername(username, req.db)
        if (!detailUser) return response(400, null, `User tidak terdaftar!`, res)

        if (detailUser.email != email) {
            const existingEmail = await UserModel.getUserByEmail(email, req.db)
            if (existingEmail != null) return response(400, null, `Email telah digunakan!`, res)
        }

        if (req.file) {
            if (!req.file.mimetype.startsWith('image/')) {
                return response(400, null, `File yang diunggah bukan gambar!`, res)
            }

            const localFilePath = req.file.path
            const remoteFilePath = req.file.filename
            await uploadFileToFTP(localFilePath, remoteFilePath)
            const avatar = remoteFilePath // Update file path to remote path
            fs.unlinkSync(localFilePath) // Delete local file after upload

            await UserModel.updateUserAvatarByUsername(username, avatar, req.db)
        }

        if (passwordLama) {
            const isPasswordValid = await bcrypt.compareSync(passwordLama, detailUser.password)

            if (isPasswordValid) {
                await UserModel.updateUserPasswordByUsername(username, await bcrypt.hash(passwordBaru, 10), req.db)
            } else {
                return response(400, null, `Password salah!`, res)
            }
        }

        await UserModel.updateUserByUsername(username, { email, role: id_role }, req.db)

        return response(201, {}, `Berhasil update user!`, res)
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal Server Error!`, res)
    }
}

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body
        const detailUser = await UserModel.getUserWithRoleByEmail(email, req.db)
        if (!detailUser) return response(400, null, `Email tidak terdaftar!`, res)

        const randomPassword = crypto.randomBytes(Math.ceil(8 / 2)).toString('hex').slice(0, 8)
        await UserModel.updateUserPasswordByEmail(email, await bcrypt.hash(randomPassword, 10), req.db)

        const text = `Assalamualaikum Warahmatullahi Wabarakatuh! ${detailUser.nama_guru ?? detailUser.nama_siswa}\n\nSesuai dengan permintaan anda perihal reset password, berikut adalah detail akun yang digunakan untuk login di aplikasi Ispagram\nUsername: ${detailUser.username}\nPassword: ${randomPassword}\n\nNote: Segera ganti password anda agar mudah diingat`
        Mailer.SendMail(email, `Informasi Reset Password`, text)

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
        }, req.db)

        return response(201, {}, `Berhasil tambah user!`, res)
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal Server Error!`, res)
    }
}

// let faceMatcher

// const recognition = async (req, res) => {
//     try {
//         const { image } = req.body;
//         const detections = await faceapi
//             .detectAllFaces(Buffer.from(image, 'base64'), new faceapi.TinyFaceDetectorOptions())
//             .withFaceLandmarks()
//             .withFaceDescriptors();

//         if (faceMatcher) {
//             const result = detections.map(d => {
//                 return faceMatcher.findBestMatch(d.descriptor);
//             });

//             return response(200, result, `Face Match`, res)
//         } else {
//             return response(404, null, `Face Not Found`, res)
//         }
//     } catch (error) {
//         console.error(error);
//         return response(500, null, `Internal Server Error`, res);
//     }
// }

module.exports = { users, detail, update, store, forgetPassword }