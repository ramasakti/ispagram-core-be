require('dotenv').config()
const express = require('express')
const http = require('http')
const os = require('os');
const faceapi = require('face-api.js')
const WebSocket = require('ws')
const app = express()
const server = http.createServer(app)
const wss = require('./utilities/websocket')
const path = require('path')
const initCronJobs = require('./Cron/CronJob')
const cron = require('node-cron')
const db = require('./Config')
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

const acceptedHost = [
    `http://${getServerIP()}:3000`,
    'http://localhost:3000',
    'https://smaispa.sch.id',
    'http://ispagram.vercel.app',
    'https://ispagram.vercel.app',
]

const corsOptions = {
    origin: function (origin, callback) {
        // Cek apakah origin termasuk dalam daftar yang diizinkan
        if (acceptedHost.indexOf(origin) !== -1) {
            callback(null, true);
        } else if (!origin) {
            // Blokir permintaan tanpa header origin (contoh: dari localhost)
            callback(new Error('Not allowed by CORS'));
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}

app.use((req, res, next) => {
    if (req.path.startsWith('/upload')) {
        next()
    } else {
        cors(corsOptions)(req, res, next);
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

initCronJobs()

wss(server)

// const getLabeledFaceDescriptors = () => {
//     const labeledFaceDescriptors = [];

//     // Ganti label dan path file gambar sesuai dengan keinginan Anda
//     const labeledFaces = [
//         { label: "rama", path: "labels/rama/", count: 2 },
//         { label: "aziz", path: "labels/aziz/", count: 2 },
//         { label: "sulton", path: "labels/sulton/", count: 2 },
//         // Tambahkan label dan path file gambar lainnya jika diperlukan
//     ];

//     return Promise.all(
//         labeledFaces.map(async (labeledFace) => {
//             const { label, path, count } = labeledFace;
//             const descriptions = [];

//             for (let i = 1; i <= count; i++) {
//                 const img = await faceapi.fetchImage(`${path}${i}.png`);
//                 const detections = await faceapi
//                     .detectSingleFace(img)
//                     .withFaceLandmarks()
//                     .withFaceDescriptor();
//                 descriptions.push(detections.descriptor);
//             }

//             const labeledFaceDescriptor = new faceapi.LabeledFaceDescriptors(label, descriptions);
//             labeledFaceDescriptors.push(labeledFaceDescriptor);

//             return labeledFaceDescriptor;
//         })
//     ).then(() => labeledFaceDescriptors);
// }

// async function setupFaceMatcher() {
//     const labeledFaceDescriptors = await getLabeledFaceDescriptors();
//     faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);
// }

server.listen(8080, async () => {
    // await setupFaceMatcher();
    console.log(`Server is running`)
})