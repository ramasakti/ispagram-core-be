const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../Config')
const response = require('../Response')
const moment = require('../utilities/moment')

const auth = async (req, res) => {
    const { username, password } = req.body

    try {
        // Jangan kembalikan password
        // Manipulasi dulu untuk menentukan role karena kita butuh role dinamis yang tiap hari bisa ganti role
        // Buat variabel baru kemudian variabel baru itulah yang dikirim ke FE
        
        // Periksa apakah username terdaftar
        const user = await db('user').where('username', username).first()
        if (!user) {
            return response(404, {}, 'Not Authorized', res)
        }

        // Periksa apakah password yang diinputkan sama dengan di database
        const isPasswordValid = await bcrypt.compareSync(password, user.password)
        if (!isPasswordValid) {
            return response(401, {}, `Invalid Password ${password}`, res)
        }

        // Buat token
        const token = jwt.sign({ userId: user.username }, 'parlaungan1980', { expiresIn: '1h' })

        // Manipulasi role
        if (user.role === 'Guru') {
            const piket = await db('hari').where('nama_hari',  moment().format('dddd')).where('piket', user.username).first()
            const walas = await db('kelas').where('walas', user.username).first()

            // Jika terjadwal piket
            if (piket) {
                const dataUser = {
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
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
                const dataUser = {
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
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