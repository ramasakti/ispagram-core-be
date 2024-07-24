const db = require('../Config')
const response = require('../Response')
const NavlandModel = require('../Model/NavlandModel')

const navland = async (req, res) => {
    try {
        const navland = await NavlandModel.getAllNavland()

        return response(200, navland, ``, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error`, res)
    }
}

const store = async (req, res) => {
    try {
        const { name, url, order, active } = req.body
        if (!name || !url || !order) return response(400, null, ``, res)

        await NavlandModel.insertNavland({ name, url, order })

        return response(201, {}, `Berhasil Tambah Navland`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error`, res)
    }
}

const update = async (req, res) => {
    try {
        const id_navland = req.params.navland
        const { name, url, order, active } = req.body

        await NavlandModel.updateNavland(id_navland, { name, url, order, active })

        return response(201, {}, `Berhasil Update Navland`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error`, res)
    }
}

const destroy = async (req, res) => {
    try {
        const id_navland = req.params.navland

        await NavlandModel.deleteNavland(id_navland)

        return response(201, {}, `Berhasil Delete Navland`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error`, res)
    }
}

module.exports = {
    navland, store, update, destroy
};
