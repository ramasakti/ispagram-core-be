const db = require('./../Config')
const response = require('./../Response')
const fs = require('fs')
const bcrypt = require('bcryptjs')

const users = async (req, res) => {
    const users = await db('user').where('username', '!=', 'adminabsen').select('username', 'name', 'email', 'avatar', 'role')
    return response(200, users, `Data Users`, res)
}

const detailUser = async (req, res) => {
    const detailUser = await db('user').where('username', req.params.username).first()
    if (!detailUser) return response(400, null, `User tidak terdaftar!`, res)
    return response(200, detailUser, `Detail User ${detailUser.username}`, res)
}

const updateUser = async (req, res) => {
    const { email, password, role } = req.body
    const username = req.params.username
    const detailUser = await db('user').where('username', username).first()
    if (!detailUser) return response(400, null, `User tidak terdaftar!`, res)

    if (req.file) {
        if (!req.file.mimetype.startsWith('image/')) {
            return response(400, null, `File yang diunggah bukan gambar!`, res)
        }
        const avatarData = fs.readFileSync(req.file.path)
        
        await db('user').where('username', username).update({ avatar: req.file.path })
    }

    if (password != 'undefined') {
        await db('user').where('username', username).update({
            email, password: await bcrypt.hash(password, 10), role
        })
    }else[
        await db('user').where('username', username).update({
            email, role
        })
    ]

    return response(201, {}, `Berhasil update user!`, res)
}

module.exports = { users, detailUser, updateUser }