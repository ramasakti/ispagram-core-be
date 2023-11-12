const db = require('../Config')
const response = require('../Response')
const moment = require('../utilities/moment')

const biodata = async (req, res) => {
    try {
        // Tangkap username dari parameter
        const username = req.params.username

        // Periksa di database apakah user terdaftar
        const detailUser = await db('user').where('username', username).first()
        if (!detailUser) return response(400, null, `User tidak terdaftar!`, res)

        if (detailUser.role !== 'Siswa') {
            const guru = await db('guru').where('guru.id_guru', username).first()
            const data = {
                id_guru: guru.id_guru,
                nama_guru: guru.nama_guru,
                alamat: guru.alamat,
                telp: guru.telp,
                tempat_lahir: guru.tempat_lahir,
                tanggal_lahir: moment(guru.tanggal_lahir).format('YYYY-MM-DD')
            }

            return response(200, data, `Detail Biodata`, res)
        } else {
            const data = await db('siswa')
                .join('detail_siswa', 'detail_siswa.siswa_id', '=', 'siswa.id_siswa')
                .where('siswa.id_siswa', username)
                .first()

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
        const { nama, alamat, whatsapp, tempat_lahir, tanggal_lahir, sk_pengangkatan, nik, no_kk, scan_kk, norek } = req.body

        // Periksa di database apakah user terdaftar
        const detailUser = await db('user').where('username', username).first()
        if (!detailUser) return response(400, null, `User tidak terdaftar!`, res)

        if (detailUser.role !== 'Siswa') {
            const guru = await db('guru').where('guru.id_guru', username).first()
            
            await db('guru').where('id_guru', username)
                .update({
                    nama_guru: nama,
                    alamat,
                    telp: whatsapp,
                    tempat_lahir,
                    tanggal_lahir
                })

            await db('detail_guru').where('guru_id')
                update({
                    sk_pengangkatan, nik, no_kk, scan_kk, norek
                })

            return response(201, {}, `Berhasil update data!`, res)
        } else {
            const siswa = await db('siswa')
                .join('detail_siswa', 'detail_siswa.siswa_id', '=', 'siswa.id_siswa')
                .where('siswa.id_siswa', username)
                .first()

            return response(201, {}, `Berhasil update data!`, res)
        }
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal Server Error!`, res)   
    }
}

module.exports = {
    biodata,
    updateBiodata
};
