const express = require('express')
const app = express()
const siswaRouter = require('./SiswaRouter')
const loginRouter = require('./LoginRouter')

app.use(siswaRouter)
app.use(loginRouter)

module.exports = siswaRouter