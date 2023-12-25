const db = require('./Config')
const cron = require('node-cron')
const moment = require('./Utilities/Moment')

const hariLibur = async () => {
    const tahun = moment().format('YYYY')
    const response = await fetch(`https://api-harilibur.vercel.app/api?year=${tahun}`)
    const data = await response.json()

    const libur = data.filter(libur => libur.is_national_holiday === true)

    libur.map(async item => {
        await db('libur').insert({
            keterangan: item.holiday_name,
            mulai: item.holiday_date,
            sampai: item.holiday_date
        })
    })
}

cron.schedule('0 0 1 1 *', hariLibur, {
    scheduled: true,
    timezone: 'Asia/Jakarta'
})

module.exports = {
    cron
};
