const session = require('express-session')
const db = require('./../Config')
const response = require('./../Response')

const auth = (req, res) => {
    const { username, password } = req.body
    const sql = `SELECT * FROM user WHERE username = '${username}' AND password = '${password}'`
    db.query(sql, (err, field) => {
        if (err) throw err
        if (field.length < 1) response(404, {}, 'Not Authorized', res)
        session({
            secret: 'detailUser',
            saveUninitialized: TRUE,
        })
        response(200, field, 'Authenticated', res)
    })
}