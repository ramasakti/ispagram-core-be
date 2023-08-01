const session = require('express-session')
const db = require('../Config')
const response = require('../Response')

const auth = async (req, res) => {
    const { username, password } = req.body
    const authenticate = await db('user').select().where('username', username).where('password', password)
    if (authenticate.length < 1) response(404, {}, 'Not Authorized', res)
    session({
        secret: 'detailUser',
        saveUninitialized: TRUE,
    })
    return response(200, authenticate, 'Authenticated', res)
}

module.exports = { auth }