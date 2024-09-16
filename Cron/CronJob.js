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
    console.log('Cron Start')
    await LiburNasional()
    cron.schedule('0 0 1 1 *', LiburNasional);
    cron.schedule('34 14 * * *', RekapAbsenHarian);
    cron.schedule('38 14 * * *', ResetAbsenHarian);
}

module.exports = initCronJobs