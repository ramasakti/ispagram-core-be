require('dotenv').config()
const express = require('express')
const http = require('http')
const os = require('os')
const faceapi = require('face-api.js')
const app = express()
const server = http.createServer(app)
const wss = require('./utilities/websocket')
const path = require('path')
const initCronJobs = require('./Cron/CronJob')
const getDatabaseConnection = require('./DynamicDBConf')
const router = require('./router/Router')
const cors = require('cors')
const moment = require('./utilities/Moment')
moment.locale('id')

const getServerIP = () => {
    const interfaces = os.networkInterfaces()
    for (let interfaceName in interfaces) {
        for (let iface of interfaces[interfaceName]) {
            if (iface.family === 'IPv4' && !iface.internal) return iface.address
        }
    }
    return null
}

const log = []

const acceptedHost = [
    `http://${getServerIP()}:3000`,
    `http://${getServerIP()}:8080`,
    'http://localhost:3000',
    'https://smaispa.sch.id',
    'https://api.smaispa.sch.id',
    'https://smparditamawaru.sch.id',
    'https://api.smparditamawaru.sch.id',
    'ispagram.vercel.app',
    'http://ispagram.vercel.app',
    'https://ispagram.vercel.app',
    'arditama.vercel.app',
    'http://arditama.vercel.app',
    'https://arditama.vercel.app',
    'https://ispagram.smpislamparlaungan.sch.id',
    'smpispa.vercel.app',
    'http://smpispa.vercel.app',
    'https://smpispa.vercel.app',
]

const corsOptions = {
    origin: async function (origin, callback) {
        // Cek apakah origin termasuk dalam daftar yang diizinkan
        if (acceptedHost.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}

const selectDatabase = (req, res, next) => {
    if (req.method === 'OPTIONS') return next()
    const dbID = req.headers['x-app-id']
    if (!dbID) {
        res.status(401).json({
            payload: null,
            message: `Unauthorized`,
            metadata: {
                prev: "",
                next: "",
                current: ""
            }
        })
    }
    req.db = getDatabaseConnection(dbID)
    next()
}

app.use(selectDatabase)

app.use((req, res, next) => {
    if (req.path.startsWith('/upload')) {
        next()
    } else {
        cors(corsOptions)(req, res, (err) => {
            log.push({
                header: req.headers,
                route: req.path
            })
            if (err) {
                res.status(403).json({
                    payload: null,
                    message: err.message,
                    metadata: {
                        prev: "",
                        next: "",
                        current: ""
                    }
                })
            } else {
                next()
            }
        })
    }
})

app.use(express.json())
app.use(router)

app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use('/upload', express.static('upload', {
    setHeaders: (res) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
    },
}))

app.get('/logs', (req, res) => res.json(log))

initCronJobs()

wss(server)

server.listen(8080, async () => {
    // await setupFaceMatcher();
    console.log(`Server is running`)
})