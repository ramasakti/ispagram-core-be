require('dotenv').config()
const express = require('express')
const http = require('http')
const WebSocket = require('ws')
const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })
const cron = require('node-cron')
const path = require('path')
const db = require('./Config')
const router = require('./router/Router')
const cors = require('cors')
const moment = require('./utilities/Moment')

const acceptedHost = ['http://localhost:3000', 'https://smaispa.sch.id', 'http://127.0.0.1:5500']

app.use((req, res, next) => {
    const ipv6 = req.ip
    const ipv4 = ipv6.includes('::ffff:') ? ipv6.split('::ffff:')[1] : ipv6
    const modifiedIP = `http://${ipv4}:3000`
    acceptedHost.push(modifiedIP)
    next()
})

const corsOptions = {
    origin: function (origin, callback) {
        if (acceptedHost.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback('403 Forbidden');
        }
    },
}

app.use(express.json())
app.use(cors(corsOptions))
app.use(router)

app.use('/upload', express.static(path.join(__dirname, 'upload')))

// Node Cron
//  ┌────────────── second (optional)
//  │ ┌──────────── minute
//  │ │ ┌────────── hour
//  │ │ │ ┌──────── day of month
//  │ │ │ │ ┌────── month
//  │ │ │ │ │ ┌──── day of week
//  │ │ │ │ │ │
//  │ │ │ │ │ │
//  * * * * * *

wss.on('connection', function connection(ws) {
    console.log('Koneksi WebSocket terbuka')

    ws.onmessage = incoming = async (ws) => {
        console.log(`Pesan diterima ${ws}`);
    }

    ws.onclose = async (ws) => {
        console.log('Koneksi WebSocket ditutup')
    }
})

server.listen(8080, async () => {
    console.log(`Server is running`)
})