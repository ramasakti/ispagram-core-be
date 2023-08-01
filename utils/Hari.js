const moment = require('moment')
const db = require('./../Config')
const response = require('./../Response')
const hariIni = moment().format('dddd')

const hariLokal = () => {
    switch (hariIni) {
        case 'Sunday':
            return 'Minggu'
            break;
        case 'Monday':
            return 'Senin'
            break;
        case 'Friday':
            return 'Jumat'
            break;
        default:
            break;
    }
}

const detailHariIni = async (req, res) => {
    const detailHariIni = await db('hari').select().where('nama_hari', hariLokal())
    return detailHariIni
}

module.exports = detailHariIni