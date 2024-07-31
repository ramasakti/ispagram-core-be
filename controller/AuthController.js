const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const response = require('../Response')
const moment = require('../utilities/Moment')
const UserModel = require('../Model/UserModel')
const KelasModel = require('../Model/KelasModel')
const HariModel = require('../Model/HariModel')
const RoleModel = require('../Model/RoleModel')

const validTokens = {};

const auth = async (req, res) => {
    const { email, username, password } = req.body
    try {
        let user = ''
        let token = ''
        let name = ''
        // Jangan kembalikan password
        // Manipulasi dulu untuk menentukan role karena kita butuh role dinamis yang tiap hari bisa ganti role
        // Buat variabel baru kemudian variabel baru itulah yang dikirim ke FE

        if (email) {
            // Login dengan OAuth, langsung ambil detail user
            user = await UserModel.getUserWithRoleByEmail(email)
            if (!user) return response(404, null, `Not Authorized`, res)

            // Buat token
            token = jwt.sign({ userId: user.username }, 'parlaungan1980', { expiresIn: '1h' })
            validTokens[token] = {
                expiresAt: new Date().getTime() + 3600 * 1000, // Waktu kadaluarsa 1 jam
                userData: { userId: user.username, name: user.name, id_role: user.id_role, role: user.id_role } // Informasi tambahan yang diperlukan
            };
        } else {
            // Periksa apakah username terdaftar
            user = await UserModel.getUserWithRoleByUsername(username)
            if (!user) return response(404, {}, 'Not Authorized', res)

            // Periksa apakah password yang diinputkan sama dengan di database
            const isPasswordValid = await bcrypt.compareSync(password, user.password)
            if (!isPasswordValid) return response(401, {}, `Invalid Password ${password}`, res)

            // Buat token
            token = jwt.sign({ userId: user.username }, 'parlaungan1980', { expiresIn: '1h' })
            validTokens[token] = {
                expiresAt: new Date().getTime() + 3600 * 1000, // Waktu kadaluarsa 1 jam
                userData: { userId: user.username, name: user.name } // Informasi tambahan yang diperlukan
            };
        }

        // Manipulasi role
        if (user.role === 'Guru') {
            const piket = await HariModel.getHariWithPiketByPiket(user.username)
            const walas = await KelasModel.getKelasByWalas(user.username)
            
            // Jika terjadwal piket
            if (piket) {
                const role = await RoleModel.getRoleByRole('Piket')
                let dataUser = {
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    id_role: role.id_role,
                    role: 'Piket',
                }

                // Jika terjadwal piket dan wali kelas
                if (walas) {
                    dataUser.walas = true
                    dataUser.kelas_id = walas.id_kelas
                }

                return response(200, { token, user: dataUser }, 'Authenticated', res)
            }

            // Jika wali kelas
            if (walas) {
                const role = await RoleModel.getRoleByRole('Wali Kelas')
                const dataUser = {
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    id_role: role.id_role,
                    role: 'Walas',
                    walas: true,
                    kelas_id: walas.id_kelas
                }

                return response(200, { token, user: dataUser }, 'Authenticated', res)
            }
        }

        // Hapus properti password
        delete user.password

        return response(200, { token, user }, 'Authenticated', res)
    } catch (error) {
        console.error(error)
        return response(500, {}, 'Internal Server Error', res)
    }
}

module.exports = { auth }