const WhatsAppModel = require('../Model/WhatsAppModel')
const response = require('../Response')

const primary = async (req, res) => {
    try {
        const primary = await WhatsAppModel.getPrimaryWhatsApp(req.db)
        return response(200, primary, ``, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const connect = async (req, res) => {
    try {
        const { name, device } = req.body
        if (!name || !device) return response(400, null, `Form is required`, res)

        const connect = await addDevice(name, device)

        if (!connect.status) return response(400, null, connect.reason, res)

        const qrcode = await getQRCode(connect.token, connect.device)
        
        await WhatsAppModel.updateWhatsApp(1, {
            nomor: device,
            token: connect.token,
            name: name,
            connected: 1
        }, req.db)

        if (!qrcode.status) return response(400, null, `${qrcode.reason}`, res)

        return response(200, qrcode, `QR Code`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const disconnect = async (req, res) => {
    try {

    } catch (error) {

    }
}

const groups = async (req, res) => {
    try {
        const token = req.body.token

        const update = await updateWhatsappGroup(token)

        if (!update.status) return response(400, null, update.detail, res)

        const groups = await getWhatsappGroups(token)
        return response(200, groups, update.detail, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

async function addDevice(name, device) {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", process.env.WHATSAPP_DEVICE_TOKEN);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("device", device);
        formData.append("autoread", "false");
        formData.append("personal", "false");
        formData.append("group", "false");

        const response = await fetch("https://api.fonnte.com/add-device", {
            method: "POST",
            headers: myHeaders,
            body: formData,
            redirect: "follow",
        });

        const result = await response.json();

        return result;
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const getQRCode = async (token, whatsapp) => {
    try {
        const header = new Headers();
        header.append("Authorization", token);

        const requestBody = new FormData();
        requestBody.append("type", "qr");
        requestBody.append("whatsapp", whatsapp);

        const options = {
            method: 'POST',
            headers: header,
            body: requestBody,
            redirect: 'follow'
        };

        const response = await fetch("https://api.fonnte.com/qr", options)
        const data = await response.json()

        return data
    } catch (error) {
        console.error(error)
    }
}

const sendToPersonal = async (req, res) => {
    try {
        const url = 'https://api.fonnte.com/send';
        const { target, message, token } = req.body;
        if (!target || !message || !token) return response(400, null, `Form tidak lengkap!`, res) 

        const data = new URLSearchParams();
        data.append('target', target);
        data.append('message', message);
        data.append('delay', '2');
        data.append('countryCode', '62');

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': token,
            },
            body: data,
        });

        const result = await response.json();

        return response(200, result, ``, res);
    }
    catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

async function updateWhatsappGroup(token) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", token);

    const formdata = new FormData();

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    const response = await fetch("https://api.fonnte.com/fetch-group", requestOptions)
    const data = await response.json()

    return data
}

async function getWhatsappGroups(token) {
    try {
        const header = new Headers();
        header.append("Authorization", token);

        const requestOptions = {
            method: 'POST',
            headers: header,
            redirect: 'follow'
        };

        const response = await fetch("https://api.fonnte.com/get-whatsapp-group", requestOptions)
        const data = await response.json()

        return data
    } catch (error) {
        console.error('Error:', error);
        throw error; // Re-throw the error for further handling
    }
}

module.exports = {
    primary,
    connect,
    disconnect,
    groups,
    addDevice,
    sendToPersonal
};
