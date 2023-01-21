const express = require('express')
const app = express()
const siswaRouter = require('./SiswaRouter')
const loginRouter = require('./LoginRouter')
const absenRouter = require('./AbsenRouter')

app.use(absenRouter)
app.use(siswaRouter)
app.use(loginRouter)

module.exports = app