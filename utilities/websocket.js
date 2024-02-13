const WebSocket = require('ws');

const websocket = async (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            console.log('received: %s', message)
            // Tambahkan logika penanganan pesan WebSocket di sini
            // Contoh: kirim pesan ke semua klien yang terhubung
            wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            })
        })
    })
}

module.exports = websocket;