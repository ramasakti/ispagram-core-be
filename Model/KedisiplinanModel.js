const getAllKedisiplinan = async (trx) => await trx('kedisiplinan')

const getKedisiplinanByDateRangeAndKelas = async (kelas, dari, sampai, trx) => {
    return await trx('siswa')
        .select('siswa.id_siswa', 'detail_siswa.nama_siswa', trx.raw('SUM(kedisiplinan.point) AS point'))
        .join('kedisiplinan', 'kedisiplinan.siswa_id', '=', 'siswa.id_siswa')
        .join('detail_siswa', 'detail_siswa.id_siswa', '=', 'siswa.id_siswa')
        .whereBetween('kedisiplinan.tanggal', [dari, sampai])
        .andWhere('siswa.kelas_id', kelas)
        .groupBy('siswa.id_siswa', 'detail_siswa.nama_siswa');
};


const insertKedisiplinan = async (req, trx) => await trx('kedisiplinan').insert(req)

const updateKedisiplinan = async (id_kedisiplinan, req, trx) => await trx('kedisiplinan').where('id_kedisiplinan', id_kedisiplinan).update(req)

const deleteKedisiplinan = async (id_kedisiplinan, trx) => await trx('kedisiplinan').where('id_kedisiplinan', id_kedisiplinan).del()

module.exports = {
    getAllKedisiplinan,
    getKedisiplinanByDateRangeAndKelas,
    insertKedisiplinan,
    updateKedisiplinan,
    deleteKedisiplinan
};