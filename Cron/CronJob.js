const cron = require('node-cron');
const LiburNasional = require('./LiburNasional');
const ResetAbsenHarian = require('./ResetAbsenHarian');
const RekapAbsenHarian = require('./RekapAbsenHarian');

// Node Cron
//  ┌────────────── second (optional)
//  │ ┌──────────── minute
//  │ │ ┌────────── hour
//  │ │ │ ┌──────── day of month
//  │ │ │ │ ┌────── month
//  │ │ │ │ │ ┌──── day of week
//  │ │ │ │ │ │
//  │ │ │ │ │ │
//  * * * * * *

const initCronJobs = async () => {
    await LiburNasional()
    cron.schedule('0 0 1 1 *', LiburNasional);
    cron.schedule('59 23 * * *', RekapAbsenHarian);
    cron.schedule('0 0 * * *', ResetAbsenHarian);
}

module.exports = initCronJobs