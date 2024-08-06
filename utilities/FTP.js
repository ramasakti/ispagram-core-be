const ftp = require("basic-ftp")

async function uploadFileToFTP(localFilePath, remoteFilePath) {
    const client = new ftp.Client()
    client.ftp.verbose = true
    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
            secure: false
        })
        await client.uploadFrom(localFilePath, remoteFilePath)
    }
    catch(err) {
        console.error(err)
    }
    client.close()
}

module.exports = { uploadFileToFTP }
