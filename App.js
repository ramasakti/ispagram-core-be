const express = require('express')
const app = express()
const router = require('./router/Router')
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(router)

app.listen(4500, () => {
    console.log(`Server is running`)
})