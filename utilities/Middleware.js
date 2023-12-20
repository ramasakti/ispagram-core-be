const jwt = require('jsonwebtoken')
const response = require('./../Response')

const middleware = (req, res, next) => {
    const token = req.headers['authorization']
    if (!token) return response(401, {}, 'Unauthenticated', res)

    // Hapus "Bearer " dari token yang diterima
    const tokenWithoutBearer = token.replace('Bearer ', '')

    jwt.verify(tokenWithoutBearer, 'parlaungan1980', (err, user) => {
        if (err) return response(401, token, 'Token Tidak Valid', res)
        req.user = user
        next()
    })
}

module.exports = middleware
