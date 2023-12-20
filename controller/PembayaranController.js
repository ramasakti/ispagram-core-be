const db = require('../Config')
const response = require('../Response')

const pembayaran = async (req, res) => {
    try {
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
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal server error`, res)
    }
}

const storePembayaran = async (req, res) => {
    try {     
        const nama_pembayaran = req.body.nama_pembayaran
        const nominal = parseInt(req.body.nominal.replace(/\./g, ""))
    
        if (!nama_pembayaran || !req.body.nominal) return response(400, null, `Semua isian wajib diisi!`, res)
    
        const kelas = req.body['kelas']
        if (kelas.length < 1) return response(400, null, `Kelas wajib diisi!`, res)
        const objectKelas = { kelas: kelas.map(item => item.value.toString()) }
    
        await db('pembayaran').insert({
            nama_pembayaran, nominal, kelas: objectKelas
        })
    
        return response(201, {}, `Berhasil menambahkan pembayaran baru`, res)
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal server error`, res)
    }
}

const updatePembayaran = async (req, res) => {
    try {
        const id_pembayaran = req.params.id_pembayaran
        const nama_pembayaran = req.body.nama_pembayaran

        if (typeof (req.body.nominal) != 'number') {
            var nominal = parseInt(req.body.nominal.replace(/\./g, ""))
        } else {
            var nominal = req.body.nominal
        }

        if (!nama_pembayaran || !nominal) return response(400, null, `Semua isian wajib diisi!`, res)

        const kelas = req.body['kelas']
        if (kelas.length < 1) return response(400, null, `Kelas wajib diisi!`, res)

        if (typeof(req.body.kelas[0]) == 'object') {
            var objectKelas = { kelas: kelas.map(item => item.value.toString()) }
        }else{
            var objectKelas = { kelas: req.body.kelas }
        }

        // Cek disini kalo pembayaran sudah ada yang bayar jangan bisa diedit atau dihapus

        await db('pembayaran').where('id_pembayaran', id_pembayaran)
            .update({
                nama_pembayaran, nominal, kelas: JSON.stringify(objectKelas)
            })

        return response(201, {}, `Berhasil menambahkan pembayaran baru`, res)
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal server error`, res)
    }
}

const deletePembayaran = async (req, res) => {
    try {
        const id_pembayaran = req.params.id_pembayaran
        const detailPembayaran = await db('pembayaran').where('id_pembayaran', id_pembayaran).first()
    
        if (!detailPembayaran) return response(400, null, `Pembayaran tidak ditemukan!`, res)
    
        // Cek disini kalo pembayaran sudah ada yang bayar jangan bisa diedit atau dihapus
    
        await db('pembayaran').where('id_pembayaran', id_pembayaran).del()
    
        return response(201, {}, `Berhasil hapus data pembayaran!`, res)
    } catch (error) {
        console.error(error)
        return response(400, null, `Internal server error`, res)
    }
}

module.exports = { pembayaran, storePembayaran, updatePembayaran, deletePembayaran }