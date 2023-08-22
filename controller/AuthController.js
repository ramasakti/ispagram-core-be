const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../Config')
const response = require('../Response')

const auth = async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await db('user').where('username', username).first()

        if (!user) {
            return response(404, {}, 'Not Authorized', res)
        }

        const isPasswordValid = await bcrypt.compareSync(password, user.password)

        if (!isPasswordValid) {
            return response(401, {}, `Invalid Password ${password}`, res)
        }

        const token = jwt.sign({ userId: user.username }, 'parlaungan1980', { expiresIn: '1h' })

        return response(200, { token, user }, 'Authenticated', res)
    } catch (error) {
        return response(500, {}, 'Internal Server Error', res)
    }
}


module.exports = { auth }