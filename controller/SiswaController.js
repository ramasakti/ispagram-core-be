const db = require('./../Config')
const response = require('./../Response')
const moment = require('../utilities/moment')
const ExcelJS = require('exceljs')

const allSiswa = async (req, res) => {
    const dataSiswa = await db('siswa').select()
    return response(200, dataSiswa, 'Get Data Siswa', res)
}

const siswaKelas = async (req, res) => {
    const kelas_id = req.params.kelas_id
    const siswaKelas = await db('siswa').where('kelas_id', kelas_id).select()
    return response(200, siswaKelas, `Data Siswa Kelas`, res)
}

const detailSiswa = async (req, res) => {
    const idSiswa = req.params.id_siswa
    const detailSiswa = await db('siswa').where('id_siswa', idSiswa).first()
    if (!detailSiswa) return response(400, null, `ID siswa tidak terdaftar! Data siswa tidak ditemukan!`, res)
    return response(200, detailSiswa, 'Get Detail Siswa', res)
}

const storeSiswa = async (req, res) => {
    try {
        const { id_siswa, rfid, nama_siswa, kelas_id, alamat, telp, tempat_lahir, tanggal_lahir } = req.body
        if (!id_siswa || !nama_siswa || !kelas_id || !alamat || !tempat_lahir || !tanggal_lahir) {
            return response(400, null, 'Semua data siswa harus diisi!', res)
        }
        const existingSiswa = await db('siswa').where('id_siswa', id_siswa).first()
        if (existingSiswa) {
            return response(409, null, 'ID siswa sudah ada dalam database!', res)
        }
        if (!moment(tanggal_lahir, 'YYYY-MM-DD', true).isValid()) {
            return response(400, null, 'Tanggal lahir tidak valid! Format harus YYYY-MM-DD', res)
        }
        const storeSiswa = await db('siswa').insert({
            id_siswa, rfid, nama_siswa, kelas_id, alamat, telp, tempat_lahir, tanggal_lahir
        })
        return response(201, storeSiswa, 'Berhasil menambahkan data siswa!', res)
    } catch (error) {
        console.error('Error storing data:', error)
        return response(500, null, 'Terjadi kesalahan saat menyimpan data siswa!', res)
    }
}

const updateSiswa = async (req, res) => {
    const idSiswa = req.params.id_siswa
    const { rfid, nama_siswa, kelas_id, alamat, telp, tempat_lahir, tanggal_lahir } = req.body
    const detailSiswa = await db('siswa').where('id_siswa', idSiswa).first()
    if (!detailSiswa) {
        return response(400, null, `ID siswa tidak terdaftar! Data siswa tidak ditemukan!`, res)
    }
    const tanggalLahirFormatted = moment(tanggal_lahir).format("YYYY-MM-DD")
    if (!idSiswa || !rfid || !nama_siswa || !kelas_id || !alamat || !tempat_lahir || !tanggal_lahir) {
        return response(400, null, 'Semua data siswa harus diisi!', res)
    }
    if (!moment(tanggalLahirFormatted, 'YYYY-MM-DD', true).isValid()) {
        return response(400, null, 'Tanggal lahir tidak valid! Format harus YYYY-MM-DD', res)
    }
    const updateSiswa = await db('siswa')
        .where('id_siswa', idSiswa)
        .update({
            rfid, nama_siswa, kelas_id, alamat, telp, tempat_lahir, tanggal_lahir: tanggalLahirFormatted
        })
    return response(201, updateSiswa, 'Berhasil update data siswa!', res)
}

const deleteSiswa = async (req, res) => {
    const idSiswa = req.params.id_siswa
    const detailSiswa = await db('siswa').where('id_siswa', idSiswa).first()
    if (!detailSiswa) {
        return response(400, null, `ID siswa tidak terdaftar! Data siswa tidak ditemukan!`, res)
    }
    const deleteSiswa = await db('siswa').where('id_siswa', idSiswa).del()
    return response(201, deleteSiswa, 'Berhasil delete siswa!', res)
}

const importSiswa = async (req, res) => {
    try {
        if (!req.file) return response(400, null, `No file uploaded!`, res)

        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.load(req.file.buffer)
        const worksheet = workbook.getWorksheet(1)
        const rows = worksheet.getSheetValues()

        const data = rows.slice(1).map(row => ({
            id_siswa: row[1],
            rfid: row[2],
            nama_siswa: row[3],
            kelas_id: row[4],
            alamat: row[5],
            telp: row[6],
            tempat_lahir: row[7],
            tanggal_lahir: row[8]
        }))

        const kelas = await db('kelas').select('id_kelas')
        const existingSiswaId = await db('siswa').pluck('id_siswa')

        const filteredData = data.map(row => {
            const rowIdSiswa = row.id_siswa

            if (existingSiswaId.includes(rowIdSiswa)) {
                return response(400, null, `Data siswa ${rowIdSiswa} already exists!`, res)
            } else if (!kelas.find(kelasData => kelasData.id_kelas === row.kelas_id)) {
                return response(400, null, `Data kelas tidak valid!`, res)
            } else {
                return row
            }
        })

        for (const siswa of filteredData) {
            await db('siswa').insert(siswa);

            await db('absen').insert({
                id_siswa: siswa.id_siswa,
                waktu_absen: null,
                izin: null,
                keterangan: ''
            });

            await db('detail_siswa').insert({
                siswa_id: siswa.id_siswa
            });
        }

        return response(200, null, `Berhasil import siswa!`, res)
    }
    catch (error) {
        console.error(error)
        return response(500, null, `An error occurred`, res)
    }
}

module.exports = { allSiswa, siswaKelas, detailSiswa, storeSiswa, updateSiswa, deleteSiswa, importSiswa }