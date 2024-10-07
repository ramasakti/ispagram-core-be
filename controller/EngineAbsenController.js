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
        const rfid = await SiswaModel.getSiswaByRFID(username, req.db)
        const user = await UserModel.getUserWithRoleByUsername(username, req.db) ?? rfid

        if (!user) return response(404, null, `ID Anda Tidak Terdaftar!`, res)

        if (user.role === 'Siswa') {
            const absen = await AbsenSiswaModel.dataAbsensiSiswaIndividu(user.username, req.db)
            if (absen.waktu_absen) return response(200, { avatar: user.avatar }, `${absen.nama_siswa} Sudah Absen!`, res)

            const hari = await HariModel.getHariByHari(Moment().format('dddd'), req.db)
            if (hari.masuk < Moment().format('HH:mm:ss')) {
                await AbsenSiswaModel.updateAbsenOrTerlambat(user.username, 'T', req.db)
            } else {
                await AbsenSiswaModel.updateHadir(user.username, req.db)
            }

            return response(201, { avatar: user.avatar }, `${absen.nama_siswa} Berhasil Absen!`, res)
        } else {
            // Staf
            const staf = await GuruModel.getGuruByID(username, req.db)
            if (staf.staf) {
                // Periksa apakah sudah absen
                const absen = await AbsenStafModel.getAbsenNowByGuru(username, req.db)
                if (!absen) {
                    // Insert Absen
                    await AbsenStafModel.insertAbsenStaf({
                        guru_id: user.username,
                        tanggal: Moment().format('YYYY-MM-DD'),
                        waktu: Moment().format('HH:mm:ss'),
                        keterangan: 'Hadir'
                    }, req.db)
                }

                // Staf mengajar
                const jadwal = await JadwalModel.getJadwalInARowByGuru(username, req.db)

                // Sudah absen dan tidak punya jam mengajar
                if (absen && jadwal.length < 1) return response(200, { avatar: user.avatar }, `${user.name} Sudah Absen!`, res)

                // Memiliki jadwal
                if (jadwal.length > 0) {
                    for (const item of jadwal) {
                        // Periksa apakah sudah absen ngajar
                        const jurnal = await JurnalModel.getJurnalByJadwalAndDateNow(item.id_jadwal, Moment().format('HH:mm:ss'), req.db)
                        if (jurnal.length > 0) return response(200, {}, `Selamat Mengajar! ${user.name}`, res)

                        // Absen mengajar
                        await JurnalModel.insertJurnal({
                            tanggal: Moment().format('YYYY-MM-DD'),
                            waktu: Moment().format('HH:mm:ss'),
                            jadwal_id: item.id_jadwal,
                            inval: false,
                            guru_id: item.id_guru,
                            created_by: item.id_guru
                        }, req.db)
                    }
                }
            } else {
                // Guru
                const jadwal = await JadwalModel.getJadwalInARowByGuru(username, req.db)
                if (jadwal.length < 1) return response(404, null, `Anda Tidak Memiliki Jadwal Mengajar`, res)

                for (const item of jadwal) {
                    // Periksa apakah sudah absen ngajar
                    const jurnal = await JurnalModel.getJurnalByJadwalAndDateNow(item.id_jadwal, req.db)
                    if (jurnal.length > 0) return response(201, {}, `Selamat Mengajar! ${user.name}`, res)

                    await JurnalModel.insertJurnal({
                        tanggal: Moment().format('YYYY-MM-DD'),
                        waktu: Moment().format('HH:mm:ss'),
                        jadwal_id: item.id_jadwal,
                        inval: false,
                        guru_id: item.id_guru,
                        created_by: item.id_guru
                    }, req.db)
                }
            }

            return response(201, { avatar: user.avatar}, `${user.nama_siswa ?? user.nama_guru} Berhasil Absen!`, res)
        }
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

module.exports = { engine }