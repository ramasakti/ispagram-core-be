const express = require('express')
const app = express()
const siswaRouter = require('./SiswaRouter')
const authRouter = require('./AuthRouter')
const absenRouter = require('./AbsenRouter')

app.use(absenRouter)
app.use(siswaRouter)
app.use(authRouter)

module.exports = app