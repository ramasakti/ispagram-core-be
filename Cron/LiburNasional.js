const db = require('../Config')
const axios = require('axios')
const moment = require('../utilities/Moment')
const LiburModel = require('../Model/LiburModel')

const isDateInRange = (date, start, end) => date >= start && date <= end

const hariLibur = async () => {
    try {
        const tahun = moment().format('YYYY')
        const response = await axios.get(`https://api-harilibur.vercel.app/api?year=${tahun}`)
        const data = response.data
    
        const liburNasional = data.filter(libur => libur.is_national_holiday === true)
    
        let dataLibur = await LiburModel.getAllLibur()
        dataLibur = dataLibur.map(libur => {
            return {
                id_libur: libur.id_libur,
                keterangan: libur.keterangan,
                mulai: moment(libur.mulai).format('YYYY-MM-DD'),
                sampai: moment(libur.sampai).format('YYYY-MM-DD')
            }
        })
    
        function filterNationalHolidays(dataLibur, liburNasional) {
            return liburNasional.filter(nationalHoliday => {
                if (nationalHoliday.holiday_date.length < 10) {
                    const tgl = nationalHoliday.holiday_date.split('-')
                    nationalHoliday.holiday_date = `${tgl[0]}-${tgl[1]}-0${tgl[2]}`
                }
                return !dataLibur.some(localHoliday =>
                    isDateInRange(nationalHoliday.holiday_date, localHoliday.mulai, localHoliday.sampai)
                )
            })
        }
    
        const hasilFilter = filterNationalHolidays(dataLibur, liburNasional)
    
        hasilFilter.map(async item => {
            await LiburModel.insertLibur({
                keterangan: item.holiday_name,
                mulai: item.holiday_date,
                sampai: item.holiday_date
            })
        })

        return
    } catch (error) {
        return null
    }
}

module.exports = hariLibur