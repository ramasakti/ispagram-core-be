const response = require('../Response')
const moment = require('../Utilities/Moment')
const UserModel = require('../Model/UserModel')
const GuruModel = require('../Model/GuruModel')
const SiswaModel = require('../Model/SiswaModel')
const BiodataModel = require('../Model/BiodataModel')

const biodata = async (req, res) => {
    try {
        // Tangkap username dari parameter
        const username = req.params.username

        // Periksa di database apakah user terdaftar
        const detailUser = await UserModel.getUserByUsername(username)
        if (!detailUser) return response(400, null, `User tidak terdaftar!`, res)

        if (detailUser.role !== 'Siswa') {
            const guru = await GuruModel.getGuruByID(username)
            const data = {
                id_guru: guru.id_guru,
                nama_guru: guru.nama_guru,
                alamat: guru.alamat,
                telp: guru.telp,
                tempat_lahir: guru.tempat_lahir,
                tanggal_lahir: moment(guru.tanggal_lahir).format('YYYY-MM-DD'),
                sk_pengangkatan: guru.sk_pengangkatan,
                nik: guru.nik,
                no_kk: guru.no_kk,
                norek: guru.norek
            }

            return response(200, data, `Detail Biodata`, res)
        } else {
            const data = await SiswaModel.getSiswaByID(username)

            return response(200, data, `Detail Biodata`, res)
        }
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal Server Error!`, res)
    }
}

const updateBiodata = async (req, res) => {
    try {
        // Tangkap username dari parameter
        const username = req.params.username

        // Periksa di database apakah user terdaftar
        const detailUser = await UserModel.getUserByUsername(username)

        if (!detailUser) return response(400, null, `User tidak terdaftar!`, res)

        if (detailUser.role !== 'Siswa') {
            const { nama, alamat, whatsapp, tempat_lahir, tanggal_lahir, sk_pengangkatan, nik, no_kk, scan_kk, norek } = req.body
            const guru = await GuruModel.getGuruByID(username)

            await GuruModel.updateGuru(username, {
                nama_guru: nama ?? guru.nama_guru,
                alamat: alamat ?? guru.alamat,
                telp: whatsapp ?? guru.telp,
                tempat_lahir: tempat_lahir ?? guru.tempat_lahir,
                tanggal_lahir: tanggal_lahir ?? guru.tanggal_lahir
            })

            // await GuruModel.updateDetailGuru(username, {
            //     sk_pengangkatan, nik, no_kk, scan_kk, norek
            // })

            return response(201, {}, `Berhasil update data!`, res)
        } else {
            const siswa = await SiswaModel.getDetailSiswaByID(username)

            const { nama_siswa, alamat, telp, tempat_lahir, tanggal_lahir, nisn, nik, nokk, scan_kk, transportasi, anak, jenis_tinggal, askol, scan_ijazah, ibu, nik_ibu, pendidikan_ibu, profesi_ibu, penghasilan_ibu, telp_ibu, ayah, nik_ayah, pendidikan_ayah, profesi_ayah, penghasilan_ayah, telp_ayah, tinggi, berat } = req.body

            SiswaModel.updateSiswaByID(username, {
                nama_siswa: nama_siswa ?? siswa.nama_siswa,
                alamat: alamat ?? siswa.alamat,
                telp: telp ?? siswa.telp,
                tempat_lahir: tempat_lahir ?? siswa.tempat_lahir,
                tanggal_lahir: tanggal_lahir ?? siswa.tanggal_lahir,
            })

            await SiswaModel.updateDetailSiswaByID(username, {
                nisn,
                nik,
                nokk,
                scan_kk,
                transportasi,
                anak,
                jenis_tinggal,
                askol,
                scan_ijazah,
                ibu,
                nik_ibu,
                pendidikan_ibu,
                profesi_ibu,
                penghasilan_ibu,
                telp_ibu,
                ayah,
                nik_ayah,
                pendidikan_ayah,
                profesi_ayah,
                penghasilan_ayah,
                telp_ayah,
                tinggi,
                berat
            })

            return response(201, {}, `Berhasil update data!`, res)
        }
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal Server Error!`, res)
    }
}

const transport = async (req, res) => {
    try {
        const transportasi = await BiodataModel.getAllTransportasi()
        return response(200, transportasi, `Data Transportasi`, res)
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal Server Error!`, res)
    }
}

const jeting = async (req, res) => {
    try {
        const jeting = await BiodataModel.getAllJeting()
        return response(200, jeting, `Data Jenis Tinggal`, res)
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal Server Error!`, res)
    }
}

const pendidikan = async (req, res) => {
    try {
        const pendidikan = await BiodataModel.getAllPendidikan()
        return response(200, pendidikan, `Data Pendidikan`, res)
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal Server Error!`, res)
    }
}

const profesi = async (req, res) => {
    try {
        const profesi = await BiodataModel.getAllProfesi()
        return response(200, profesi, `Data Profesi`, res)
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal Server Error!`, res)
    }
}

module.exports = {
    biodata,
    updateBiodata,
    transport,
    jeting,
    pendidikan,
    profesi
};
