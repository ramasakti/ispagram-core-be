const response = require('../Response')
const fs = require('fs')
const path = require('path')
const SectionModel = require('../Model/SectionModel')

const section = async (req, res) => {
    try {
        const section = await SectionModel.getAllSection()
        return response(200, section, `Data Section`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const store = async (req, res) => {
    try {
        const { name, icon, order } = req.body
        if (!name || !icon || !order) return response(400, null, `Semua form wajib diisi!`, res)

        await SectionModel.createSection({ name, icon, order })
        return response(201, {}, `Berhasil tambah section!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const update = async (req, res) => {
    try {
        const id_section = req.params.id_section
        if (!id_section) return response(400, null, `Semua form wajib diisi!`, res)

        const detailSection = await SectionModel.getSectionByID(id_section)
        if (!detailSection) return response(400, null, `Section tidak ditemukan!`, res)

        const { name, icon, order } = req.body
        if (!name || !icon || !order) return response(400, null, `Semua form wajib diisi!`, res)

        await SectionModel.updateSection(id_section, {
            name, icon, order
        })
        return response(201, {}, `Berhasil update section!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const icons = async (req, res) => {
    const directoryPath = path.join(__dirname, '../icons/svg')

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error(err)
            return response(500, null, `Internal Server Error!`, res)
        } else {
            return response(200, files, `Icons`, res)
        }
    })
}

const destroy = async (req, res) => {
    try {
        const id_section = req.params.id_section

        const detailSection = await SectionModel.getSectionByID(id_section)
        if (!detailSection) return response(400, null, `Section tidak ditemukan!`, res)

        await SectionModel.deleteSection(id_section)
        return response(201, {}, `Berhasil delete section`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

module.exports = {
    section,
    store,
    update,
    icons,
    destroy
};
