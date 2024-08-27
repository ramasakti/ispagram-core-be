const db = require('../Config')
const response = require('../Response')
const moment = require('../utilities/Moment')
const existingHari = require('../utilities/HariUtils')
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
    if (await existingHari.existingHari(hari, req.db) === null) return response(400, null, `Format hari tidak sesuai!`, res);

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
    const hariData = await HariModel.getAllHariActive(req.db)
    const jamPelajaranData = [];

    hariData.forEach((hari) => {
        const jampelDuration = moment.duration(hari.jampel).asMinutes();
        let selesaiSebelumnya = null;

        // Input jam diniyah
        if (hari.diniyah) {
            const jam_diniyah = JSON.parse(hari.jam_diniyah)
            let warning = false
            var jampelStart = moment(jam_diniyah.sampai, 'HH:mm:ss')

            if (selesaiSebelumnya != null && selesaiSebelumnya != jampelStart) {
                warning = true
            }

            jamPelajaranData.push({
                hari: hari.nama_hari,
                keterangan: 'Diniyah',
                mulai: jam_diniyah.mulai,
                selesai: jam_diniyah.sampai,
                warning
            })
        } else {
            var jampelStart = moment(hari.masuk, 'HH:mm:ss');
        }

        // Tambahkan jam pelajaran berdasarkan pola
        for (let i = 1; i <= 10; i++) {
            const istirahat = JSON.parse(hari.istirahat)
            let isIstirahat = false

            let jamMulai = jampelStart.clone().add(jampelDuration * (i - 1), 'minutes');
            let jamSelesai = jamMulai.clone().add(jampelDuration, 'minutes');

            for (const istirahatObj of istirahat) {
                const istirahatMulai = moment(istirahatObj.mulai, 'HH:mm:ss');
                const istirahatSelesai = moment(istirahatObj.selesai, 'HH:mm:ss');

                if (
                    (jamMulai.isSameOrAfter(istirahatMulai) && jamMulai.isBefore(istirahatSelesai)) ||
                    (jamSelesai.isAfter(istirahatMulai) && jamSelesai.isSameOrBefore(istirahatSelesai))
                ) {
                    isIstirahat = true;
                    jamMulai = istirahatObj.mulai
                    jamSelesai = istirahatObj.selesai
                    break
                }
            }

            if (!isIstirahat) {
                if (moment.isMoment(selesaiSebelumnya)) {
                    selesaiSebelumnya = moment(selesaiSebelumnya).format('HH:mm:ss')
                }
                const mulaiSebelumnya = moment(selesaiSebelumnya || jamMulai, 'HH:mm:ss');
                const selesai = mulaiSebelumnya.add(jampelDuration, 'minutes').format('HH:mm:ss');
                jamPelajaranData.push({
                    hari: hari.nama_hari,
                    keterangan: `${hari.nama_hari} Ke-${i}`,
                    mulai: selesaiSebelumnya || moment(jamMulai).format('HH:mm:ss'),
                    selesai: selesai, // Mengambil selesai dari mulai + jampelDuration
                    warning: (selesaiSebelumnya != selesaiSebelumnya) ? true : false
                });
                selesaiSebelumnya = selesai
            } else {
                if (moment.isMoment(selesaiSebelumnya)) {
                    selesaiSebelumnya = moment(selesaiSebelumnya).format('HH:mm:ss')
                }
                jamPelajaranData.push({
                    hari: hari.nama_hari,
                    keterangan: `${hari.nama_hari} Istirahat`,
                    mulai: jamMulai,
                    selesai: jamSelesai,
                    warning: (jamMulai != selesaiSebelumnya) ? true : false
                });
                selesaiSebelumnya = jamSelesai
            }
        }
    });

    return response(200, jamPelajaranData, `Jampel`, res)
}

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