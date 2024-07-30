const nodemailer = require('nodemailer')
const db = require('../Config')

const transporter = nodemailer.createTransport({
    host: process.env.SMPTP_HOST,
    port: process.env.SMPTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMPTP_MAIL, // Ganti dengan email pengirim
        pass: process.env.SMPTP_PASS // Ganti dengan kata sandi email pengirim
    }
})

const credentialInfo = (to, subject, text) => {
    const mailOptions = {
        from: `${process.env.SMPTP_NAME} <${process.env.SMPTP_MAIL}>`, // Alamat email pengirim
        to, // Alamat email penerima
        subject, // Subjek email
        text // Isi email
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error:', error)
        } else {
            console.log('Email sent:', info.response)
        }
    })
}

const existingEmail = async (email) => {
    const existingEmail = await db('users').where('email', email).first()
    if (!existingEmail) return null
    return existingEmail
}

module.exports = { credentialInfo, existingEmail }