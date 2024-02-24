require('dotenv').config()
const express = require('express')
const http = require('http')
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

const acceptedHost = ['http://localhost:3000', 'https://smaispa.sch.id', 'http://127.0.0.1:5501', 'https://ispagram-core-fe.vercel.app']

app.use((req, res, next) => {
    const ipv6 = req.ip
    const ipv4 = ipv6.includes('::ffff:') ? ipv6.split('::ffff:')[1] : ipv6
    const modifiedIP = `http://${ipv4}:3000`
    acceptedHost.push(modifiedIP)
    next()
})

app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = acceptedHost;
        const isAllowed = !origin || allowedOrigins.includes(origin);
        callback(null, isAllowed);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
}))

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

// Coba Update Repo

server.listen(8080, async () => {
    // await setupFaceMatcher();
    console.log(`Server is running`)
})