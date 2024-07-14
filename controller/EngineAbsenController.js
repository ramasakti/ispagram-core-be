const response = require('../Response')
const UserModel = require('../Model/UserModel')
const AbsenStafModel = require('../Model/AbsenStafModel')
const AbsenSiswaModel = require('../Model/AbsenSiswaModel')
const HariModel = require('../Model/HariModel')
const Moment = require('../utilities/Moment')

const engine = async (req, res) => {
    try {
        // console.log(req.user)
        const username = req.params.username
        const user = await UserModel.getUserByUsername(username)

        if (!user) return response(404, null, `ID Anda Tidak Terdaftar!`, res)
        
        if (user.role === 'Siswa') {
            const absen = await AbsenSiswaModel.dataAbsensiSiswaIndividu(username)
            if (absen.waktu_absen) return response(200, null, `${absen.nama_siswa} Sudah Absen!`, res)

            const hari = await HariModel.getHariByHari(Moment().format('dddd'))
            if (hari.masuk < Moment().format('HH:mm:ss')) {
                await AbsenSiswaModel.updateAbsenOrTerlambat(username, 'T')
            }else{
                await AbsenSiswaModel.updateHadir(username)
            }

            return response(201, {}, `${absen.nama_siswa} Berhasil Absen!`, res)
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

            return response(201, {}, `Berhasil Absen!`, res)
        }
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

module.exports = { engine }