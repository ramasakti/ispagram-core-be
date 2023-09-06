const db = require('./../Config')
const response = require('./../Response');

const pembayaran = async (req, res) => {
    const pembayaran = await db('pembayaran').where('id_pembayaran', '!=', 1).select()
    const pembayaranTransformed = pembayaran.map((item) => {
        const kelasArray = JSON.parse(item.kelas).kelas || [];
        return {
            id_pembayaran: item.id_pembayaran,
            nama_pembayaran: item.nama_pembayaran,
            nominal: item.nominal,
            kelas: kelasArray,
            all: kelasArray.length === 0, // Menambahkan properti all jika kelasArray kosong
        };
    });

    return response(200, pembayaranTransformed, `Data Pembayaran`, res)
}

const storePembayaran = async (req, res) => {
    const nama_pembayaran = req.body.nama_pembayaran
    const nominal = parseInt(req.body.nominal.replace(/\./g, ""))
    const kelas = req.body['kelas[]']

    if (!nama_pembayaran || !nominal) return response(400, null, `Semua isian wajib diisi!`, res)

    if (kelas.length < 1) return response(400, null, `Kelas wajib diisi!`, res)

    await db('pembayaran').insert({
        nama_pembayaran, nominal, kelas: { kelas }
    })

    return response(201, {}, `Berhasil menambahkan pembayaran baru`, res)
}

const updatePembayaran = async (req, res) => {
    const id_pembayaran = req.params.id_pembayaran
    const nama_pembayaran = req.body.nama_pembayaran
    const nominal = parseInt(req.body.nominal.replace(/\./g, ""))
    const kelas = req.body['kelas[]']

    if (!nama_pembayaran || !nominal) return response(400, null, `Semua isian wajib diisi!`, res)

    if (kelas.length < 1) return response(400, null, `Kelas wajib diisi!`, res)

    // Cek disini kalo pembayaran sudah ada yang bayar jangan bisa diedit atau dihapus

    await db('pembayaran').where('id_pembayaran', id_pembayaran).update({
        nama_pembayaran, nominal, kelas: { kelas }
    })

    return response(201, {}, `Berhasil menambahkan pembayaran baru`, res)
}

const deletePembayaran = async (req, res) => {
    const id_pembayaran = req.params.id_pembayaran
    const detailPembayaran = await db('pembayaran').where('id_pembayaran', id_pembayaran).first()

    if (!detailPembayaran) return response(400, null, `Pembayaran tidak ditemukan!`, res)

    // Cek disini kalo pembayaran sudah ada yang bayar jangan bisa diedit atau dihapus
    
    await db('pembayaran').where('id_pembayaran', id_pembayaran).del()

    return response(201, {}, `Berhasil hapus data pembayaran!`, res)
}

module.exports = { pembayaran, storePembayaran, updatePembayaran, deletePembayaran }