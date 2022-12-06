const express = require('express')
const app = express()
const siswaRouter = require('./SiswaRouter')

app.use(siswaRouter)

module.exports = siswaRouter