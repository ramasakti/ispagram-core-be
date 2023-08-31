const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: "mail.smaispa.sch.id",
    port: 465,
    secure: true,
    auth: {
        user: 'admin@smaispa.sch.id', // Ganti dengan email pengirim
        pass: 'parlaungan1980' // Ganti dengan kata sandi email pengirim
    }
})

const credentialInfo = (to, subject, text) => {
    const mailOptions = {
        from: '"SMA Islam Parlaungan" <admin@smaispa.sch.id>', // Alamat email pengirim
        to, // Alamat email penerima
        subject, // Subjek email
        text // Isi email
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error:', error)
        } else {
            console.log('Email sent:', info.response)
        }
    })
}


module.exports = { credentialInfo }