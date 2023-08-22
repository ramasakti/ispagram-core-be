const express = require('express')
const app = express()
const kelasRouter = require('./KelasRouter')
const siswaRouter = require('./SiswaRouter')
const authRouter = require('./AuthRouter')
const absenRouter = require('./AbsenRouter')
const guruRouter = require('./GuruRouter')
const hariRouter = require('./HariRouter')

app.use(siswaRouter)
app.use(kelasRouter)
app.use(absenRouter)
app.use(guruRouter)
app.use(hariRouter)
app.use(authRouter)

module.exports = app