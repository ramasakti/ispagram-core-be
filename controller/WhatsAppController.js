const db = require('../Config')
const response = require('../Response')

const getContactList = async (req, res) => {
    
}

const sendToPersonal = async (req, res) => {
    try {
        const url = 'https://api.fonnte.com/send';
        const token = process.env.WHATSAPP_API_TOKEN;
        const { target, message } = req.body

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
        console.log(result);
    }
    catch (error) {
        console.error(error)
        return response(400, null, `Internal Server Error!`, res)
    }
}

module.exports = {
    sendToPersonal
};
