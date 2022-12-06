const express = require('express')
const app = express()
const router = require('./router/Router')

app.use(router)

app.listen(3000, () => {
    console.log(`Server is running`)
})