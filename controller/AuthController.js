const jwt = require('jsonwebtoken')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')
const db = require('../Config')
const response = require('../Response')

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id)
    done(null, user)
})

passport.use(new LocalStrategy(
    (username, password, done) => {
        const user = users.find(u => u.username === username && u.password === password)

        if (!user) {
            return done(null, false)
        }

        return done(null, user)
    }
))

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

        return response(200, { token }, 'Authenticated', res)
    } catch (error) {
        return response(500, {}, 'Internal Server Error', res)
    }
}


module.exports = { auth }