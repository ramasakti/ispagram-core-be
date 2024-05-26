const response = require('../Response')
const UserModel = require('../Model/UserModel')
const AbsenStafModel = require('../Model/AbsenStafModel')
const Moment = require('../utilities/Moment')

const engine = async (req, res) => {
    try {
        // console.log(req.user)
        const username = req.params.username
        const user = await UserModel.getUserByUsername(username)

        if (!user) return response(404, null, `ID Anda Tidak Terdaftar!`, res)
        
        if (user.role === 'Siswa') {
            
        }else{
            // Periksa apakah sudah absen
            const absen = await AbsenStafModel.getAbsenNowByGuru(id_guru)
            if (absen) return response(400, null, `Sudah Absen!`, res)
            
            // Insert Absen
            await AbsenStafModel.insertAbsenStaf({
                guru_id: username, 
                tanggal: moment().format('YYYY-MM-DD'),
                waktu: moment().format('HH:MM:SS'),
                keterangan: 'Hadir'
            })
        }

        return response(201, {}, `Berhasil Absen!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

module.exports = { engine }