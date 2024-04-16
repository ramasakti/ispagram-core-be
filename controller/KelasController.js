const db = require('../Config')
const response = require('../Response')
const UserModel = require('../Model/UserModel')
const KelasModel = require('../Model/KelasModel')
const SiswaModel = require('../Model/SiswaModel')
const PembayaranSiswaModel = require('../Model/PembayaranSiswaModel')
const TransaksiPembayaranSiswaModel = require('../Model/TransaksiPembayaranSiswaModel')

const kelas = async (req, res) => {
    try {
        const kelas = await KelasModel.getAllKelasWithWalas()
        return response(200, kelas, 'Berhasil get data kelas!', res)
    } catch (error) {
        console.error(error)
        return response(500, {}, 'Internal Server Error', res)
    }
}

const detail = async (req, res) => {
    try {
        const kelas_id = req.params.kelas_id
        if (!kelas_id) return response(400, null, `Kelas tidak ditemukan!`, res)

        const detailKelas = await KelasModel.getKelasWithWalasByID(kelas_id)

        return response(200, detailKelas, 'Berhasil get detail kelas!', res)
    } catch (error) {
        console.error(error)
        return response(500, {}, 'Internal Server Error', res)
    }
}

const store = async (req, res) => {
    try {
        // Tangkap inputan dan periksa
        const { tingkat, jurusan, walas } = req.body
        if (!tingkat || !jurusan || !walas) return response(409, null, `Gagal!`, res)

        // Masukkan ke database
        await KelasModel.insertKelas({ tingkat, jurusan, walas })

        return response(200, {}, 'Berhasil tambah kelas!', res)
    } catch (error) {
        console.error(error)
        return response(500, {}, 'Internal Server Error', res)
    }
}

const update = async (req, res) => {
    try {
        const id_kelas = req.params.kelas_id
        // Tangkap inputan
        const { tingkat, jurusan, walas } = req.body

        // Query ke database
        await KelasModel.updateKelas(id_kelas, {
            tingkat, jurusan, walas
        })

        return response(201, {}, 'Berhasil update data kelas!', res)
    } catch (error) {
        console.error(error)
        return response(500, {}, 'Internal Server Error', res)
    }
}

const destroy = async (req, res) => {
    try {
        // Tangkap inputan id kelas dari request parameter
        const id_kelas = req.params.kelas_id

        // Ambil informasi kelas
        const detailKelas = await KelasModel.getKelasById(id_kelas)

        // Jika kelas tidak ditemukan
        if (!detailKelas) return response(404, null, `Data kelas yang akan dihapus tidak teridentifikasi`, res)

        // Periksa apakah kelas memiliki siswa
        const existingSiswa = await SiswaModel.getSiswaByKelas(id_kelas)
        if (existingSiswa.length > 0) return response(400, null, `Gagal hapus kelas! Terdapat siswa yang terdaftar pada kelas yang akan dihapus`, res)

        // Hapus kelas dari tabel kelas
        await KelasModel.deleteKelas(id_kelas)

        return response(202, {}, 'Berhasil hapus kelas', res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const graduate = async (req, res) => {
    const trx = await db.transaction()
    try {
        // Ambil data tunggakan semua siswa
        const siswas = await SiswaModel.getAllSiswaActive()

        // Update tunggakan
        siswas.map(async siswa => {
            const tunggakans = await getTunggakanSiswaAktif(siswa.id_siswa)
            tunggakans.map(async tunggakan => {
                if ((tunggakan.terbayar !== tunggakan.nominal && tunggakan.terbayar === 0) || (tunggakan.terbayar !== 0 && tunggakan.terbayar !== tunggakan.nominal)) {
                    await TransaksiPembayaranSiswaModel.updateTunggakanBySiswa({
                        id_siswa: siswa.id_siswa,
                        pembayaran_id: tunggakan.id_pembayaran,
                    }, trx)
                }
            })
        })

        // Ambil data tingkat terakhir (XII)
        const alumnis = await KelasModel.getSiswaByTingkat('XII')
        alumnis.map(async alumni => {
            // Delete dari tabel siswa
            await SiswaModel.deleteSiswa(alumni.id_siswa, trx)

            // Update role
            await UserModel.updateUserByUsername(alumni.id_siswa, { role: 11 }, trx)
        })

        // Hapus data kelas tingkat akhir (XII)
        await KelasModel.deleteKelasByTingkat('XII', trx)

        // Hapus data pembayaran tahun ajaran ini
        await PembayaranSiswaModel.updateStatusPembayaran(0, trx)

        await trx.commit()
        return response(200, {}, `Success Naik Tingkat!`, res)
    } catch (error) {
        await trx.rollback()
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

async function getTunggakanSiswaAktif(id_siswa) {
    try {
        const siswa = await SiswaModel.getSiswaByID(id_siswa)
        if (!siswa) return response(400, null, `Siswa Tidak Terdaftar`, res)

        const kelas = siswa.kelas_id.toString()

        const dataPembayaran = await PembayaranSiswaModel.getAllPembayaran()
        const pembayaran = dataPembayaran.filter(item => item.kelas.includes(kelas))
        const idPembayaranArray = pembayaran.map(item => item.id_pembayaran)

        const detailTagihan = await PembayaranSiswaModel.getPembayaranBySiswaAndInID(idPembayaranArray, id_siswa)

        let tagihan = []
        for (var i = 0; i < pembayaran.length; i++) {
            var found = false;
            for (var j = 0; j < detailTagihan.length; j++) {
                if (pembayaran[i].id_pembayaran === detailTagihan[j].id_pembayaran) {
                    pembayaran[i].terbayar = detailTagihan[j].terbayar;
                    found = true;
                    break;
                }
            }
            if (!found) pembayaran[i].terbayar = 0;
            delete pembayaran[i].kelas;
            tagihan.push(pembayaran[i]);
        }

        return tagihan
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

module.exports = { kelas, detail, store, update, destroy, graduate, getTunggakanSiswaAktif }