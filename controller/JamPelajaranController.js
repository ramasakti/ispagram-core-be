const db = require('../Config')
const response = require('../Response')
const moment = require('../utilities/Moment')
const HariModel = require('../Model/HariModel')
const JamPelajaranModel = require('../Model/JamPelajaranModel')

const jamPelajaran = async (req, res) => {
    try {
        const jamPelajaran = await JamPelajaranModel.getAllTrueJampel(req.db)

        return response(200, jamPelajaran, `Berhasil get data jam pelajaran!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error`, res)
    }
}

const jamPelajaranFree = async (req, res) => {
    try {
        const kelas = req.params.id_kelas

        const jamPelajaranFilled = await JamPelajaranModel.getAllJampelFilledByKelas(kelas, req.db)

        let idJamPelajaranFilled = []
        jamPelajaranFilled.map(item => idJamPelajaranFilled.push(item.jampel))

        const jamPelajaranFree = await JamPelajaranModel.getAllJampelFreeByFilled(idJamPelajaranFilled, req.db)

        return response(200, jamPelajaranFree, `Data Jam Pelajaran`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error`, res)
    }
}

const detailJampel = async (req, res) => {
    try {
        if (!req.params.hari) return response(400, null, `Hari tidak terdaftar`, res)
        const detailJampel = await JamPelajaranModel.getJampelByHari(req.params.hari, req.db)

        return response(200, detailJampel, `Detail jam pelajaran`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error`, res)
    }
}

const storeJampel = async (req, res) => {
    const { hari, keterangan, mulai, selesai } = req.body;
    if (!hari || !keterangan || !mulai || !selesai) return response(400, null, `Semua field wajib diisi!`, res);

    const existingHari = await HariModel.getHariByHari(hari, trx)
    if (!existingHari) return response(400, null, `Format hari tidak sesuai!`, res);

    try {
        const result = await JamPelajaranModel.getJampelByTimeAndHari(mulai, selesai, hari, req.db)

        if (result.length < 1) {
            await JamPelajaranModel.insertJampel({
                hari: hari,
                keterangan: keterangan,
                mulai: mulai,
                selesai: selesai + ':00',
            }, req.db)

            return response(201, {}, `Berhasil menambah jam pelajaran baru!`, res);
        } else {
            return response(400, null, `Gagal! jam pelajaran berbenturan`, res);
        }
    } catch (error) {
        return response(500, null, `Internal server error!`, res);
    }
};


const updateJampel = async (req, res) => {
    const { mulai, selesai, hari, keterangan, id_jampel } = req.body
    if (!hari || !keterangan || !mulai || !selesai) return response(400, null, `Semua field wajib diisi!`, res)
    if (await existingHari.existingHari(hari) === null) return response(400, mull, `Format hari tidak sesuai!`, res)

    try {
        const result = await JamPelajaranModel.getJampelByTimeAndHari(mulai, selesai, hari, req.db)

        const existingHari = await JamPelajaranModel.getJampelByID(id_jampel, req.db)

        if (result.length < 1 || existingHari.hari === hari) {
            await JamPelajaranModel.updateJampelByID(id_jampel, req.db)

            return response(201, {}, `Berhasil update jam pelajaran!`, res)
        } else {
            return response(400, null, `Gagal! Jam berbentrokan!`, res)
        }
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const deleteJampel = async (req, res) => {
    try {
        const id_jampel = req.params.id_jampel
        const jampel = await JamPelajaranModel.getJampelByID(id_jampel, req.db)
        if (!jampel) return response(400, null, `Gagal! Jam pelajaran tidak ditemukan`, res)

        await JamPelajaranModel.deleteJampelByID(id_jampel, req.db)
        return response(201, null, `Berhasil hapus jam pelajaran`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const generateJampel = async (req, res) => {
    const hariData = await HariModel.getAllHariActive(req.db);
    const jamPelajaranData = [];

    for (const hari of hariData) {
        const jamKhusus = await HariModel.getAllJamKhususByHariID(hari.id_hari, req.db);
        const jampelDuration = moment.duration(hari.jampel).asMinutes();
        let selesaiSebelumnya = moment(hari.masuk, 'HH:mm:ss');
        let countPelajaran = 1;

        // Sortir jam khusus berdasarkan waktu mulai
        jamKhusus.sort((a, b) => moment(a.mulai, 'HH:mm:ss').diff(moment(b.mulai, 'HH:mm:ss')));

        while (selesaiSebelumnya < moment(hari.pulang, 'HH:mm:ss')) {
            let jamMulai = selesaiSebelumnya.clone();
            let jamSelesai = jamMulai.clone().add(jampelDuration, 'minutes');
            let isKhusus = false;

            // Cek apakah jam khusus ada di antara jam reguler
            for (const khusus of jamKhusus) {
                const khususMulai = moment(khusus.mulai, 'HH:mm:ss');
                const khususSelesai = moment(khusus.selesai, 'HH:mm:ss');

                // Jika jam reguler pas atau overlap dengan jam khusus
                if (jamMulai.isSameOrAfter(khususMulai) && jamMulai.isBefore(khususSelesai)) {
                    // Tambahkan jam khusus, atur mulai dari waktu khusus
                    jamPelajaranData.push({
                        hari: hari.nama_hari,
                        keterangan: khusus.keterangan,
                        mulai: khusus.mulai,
                        selesai: khusus.selesai,
                        warning: true
                    });
                    selesaiSebelumnya = khususSelesai.clone(); // Update selesai sebelumnya
                    isKhusus = true;
                    break;
                }
            }

            // Jika tidak ada jam khusus, tambahkan jam reguler
            if (!isKhusus) {
                jamPelajaranData.push({
                    hari: hari.nama_hari,
                    keterangan: `${hari.nama_hari} Ke-${countPelajaran}`,
                    mulai: jamMulai.format('HH:mm:ss'),
                    selesai: jamSelesai.format('HH:mm:ss'),
                    warning: false
                });
                selesaiSebelumnya = jamSelesai.clone();
                countPelajaran++;
            }
        }
    }

    // Sortir data berdasarkan jam mulai
    jamPelajaranData.sort((a, b) => moment(a.mulai, 'HH:mm:ss').diff(moment(b.mulai, 'HH:mm:ss')));

    return response(200, jamPelajaranData, `Jampel`, res);
};

const importJampel = async (req, res) => {
    try {
        await JamPelajaranModel.insertJampel(req.body, req.db)
        return response(201, {}, `Berhasil generate jadwal`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

module.exports = { jamPelajaran, detailJampel, storeJampel, updateJampel, deleteJampel, generateJampel, importJampel, jamPelajaranFree }