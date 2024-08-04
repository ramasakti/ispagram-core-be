const response = require('../Response')
const UserModel = require('../Model/UserModel')
const AbsenStafModel = require('../Model/AbsenStafModel')
const AbsenSiswaModel = require('../Model/AbsenSiswaModel')
const HariModel = require('../Model/HariModel')
const SiswaModel = require('../Model/SiswaModel')
const GuruModel = require('../Model/GuruModel')
const JadwalModel = require('../Model/JadwalModel')
const JurnalModel = require('../Model/JurnalModel')
const Moment = require('../utilities/Moment')

const engine = async (req, res) => {
    try {
        const username = req.params.username
        const rfid = await SiswaModel.getSiswaByRFID(username)
        const user = await UserModel.getUserWithRoleByUsername(username) ?? rfid

        if (!user) return response(404, null, `ID Anda Tidak Terdaftar!`, res)

        if (user.role === 'Siswa') {
            const absen = await AbsenSiswaModel.dataAbsensiSiswaIndividu(user.username)
            if (absen.waktu_absen) return response(200, null, `${absen.nama_siswa} Sudah Absen!`, res)

            const hari = await HariModel.getHariByHari(Moment().format('dddd'))
            if (hari.masuk < Moment().format('HH:mm:ss')) {
                await AbsenSiswaModel.updateAbsenOrTerlambat(user.username, 'T')
            } else {
                await AbsenSiswaModel.updateHadir(user.username)
            }

            return response(201, { avatar: absen.avatar }, `${absen.nama_siswa} Berhasil Absen!`, res)
        } else {
            // Staf
            const staf = await GuruModel.getGuruByID(username)
            if (staf.staf) {
                // Periksa apakah sudah absen
                const absen = await AbsenStafModel.getAbsenNowByGuru(username)
                if (!absen) {
                    // Insert Absen
                    await AbsenStafModel.insertAbsenStaf({
                        guru_id: user.username,
                        tanggal: Moment().format('YYYY-MM-DD'),
                        waktu: Moment().format('HH:mm:ss'),
                        keterangan: 'Hadir'
                    })
                }

                // Staf mengajar
                const jadwal = await JadwalModel.getJadwalInARowByGuru(username)

                // Sudah absen dan tidak punya jam mengajar
                if (absen && jadwal.length < 1) return response(404, null, `${user.name} Sudah Absen!`, res)

                // Memiliki jadwal
                if (jadwal.length > 0) {
                    for (const item of jadwal) {
                        // Periksa apakah sudah absen ngajar
                        const jurnal = await JurnalModel.getJurnalByJadwalAndDateNow(item.id_jadwal, Moment().format('HH:mm:ss'))
                        if (jurnal.length > 0) return response(304, {}, `Selamat Mengajar! ${user.name}`, res)

                        // Absen mengajar
                        await JurnalModel.insertJurnal({
                            tanggal: Moment().format('YYYY-MM-DD'),
                            waktu: Moment().format('HH:mm:ss'),
                            jadwal_id: item.id_jadwal,
                            inval: false,
                            guru_id: item.id_guru,
                            created_by: item.id_guru
                        })
                    }
                }
            } else {
                // Guru
                const jadwal = await JadwalModel.getJadwalInARowByGuru(username)
                if (jadwal.length < 1) return response(404, null, `Anda Tidak Memiliki Jadwal Mengajar`, res)

                for (const item of jadwal) {
                    // Periksa apakah sudah absen ngajar
                    const jurnal = await JurnalModel.getJurnalByJadwalAndDateNow(item.id_jadwal)
                    if (jurnal.length > 0) return response(201, {}, `Selamat Mengajar! ${user.name}`, res)

                    await JurnalModel.insertJurnal({
                        tanggal: Moment().format('YYYY-MM-DD'),
                        waktu: Moment().format('HH:mm:ss'),
                        jadwal_id: item.id_jadwal,
                        inval: false,
                        guru_id: item.id_guru,
                        created_by: item.id_guru
                    })
                }
            }

            return response(201, {}, `${user.nama_siswa ?? user.nama_guru} Berhasil Absen!`, res)
        }
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

module.exports = { engine }