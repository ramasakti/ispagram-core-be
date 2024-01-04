const cron = require('node-cron');
const LiburNasional = require('./LiburNasional');
const ResetAbsenHarian = require('./ResetAbsenHarian');
const RekapAbsenHarian = require('./RekapAbsenHarian');

const initCronJobs = async () => {
    await LiburNasional()
    cron.schedule('0 0 1 1 *', LiburNasional);
    cron.schedule('0 0 * * *', ResetAbsenHarian);
    cron.schedule('59 23 * * *', RekapAbsenHarian);
}

module.exports = initCronJobs