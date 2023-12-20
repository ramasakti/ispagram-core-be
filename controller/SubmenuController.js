const response = require('../Response')
const SubmenuModel = require('./../Model/SubmenuModel')

const submenu = async (req, res) => {
    try {
        const submenu = await SubmenuModel.getAllSubmenuWithMenu()
        return response(200, submenu, `Berhasil get data submenu`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const store = async (req, res) => {
    try {
        const { name, route, id_menu, order } = req.body
        if (!name || !route || !id_menu || !order) return response(400, null, `Semua form wajib diisi!`, res)

        await SubmenuModel.insertSubmenu({ name, route, menu_id: id_menu, order })
        return response(201, {}, `Berhasil tambah submenu!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const update = async (req, res) => {
    try {
        const id_submenu = req.params.id_submenu
        const detailSubmenu = await SubmenuModel.getSubmenuByID(id_submenu)

        if (!detailSubmenu) return response(400, null, `Submenu tidak ditemukan!`, res)

        const { submenu, route, id_menu, order } = req.body
        if (!submenu || !route || !id_menu || !order) return response(400, null, `Semua form wajib diisi!`, res)

        await SubmenuModel.updateSubmenu(id_submenu, {
            name: submenu, route, menu_id: id_menu, order
        })
        return response(201, {}, `Berhasil update submenu!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const destroy = async (req, res) => {
    try {
        const id_submenu = req.params.id_submenu
        const detailSubmenu = await SubmenuModel.getSubmenuByID(id_submenu)

        if (!detailSubmenu) return response(400, null, `Submenu tidak ditemukan!`, res)
        
        await SubmenuModel.deleteSubmenuByID(id_submenu)
        return response(201, {}, `Berhasil delete submenu!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

module.exports = {
    submenu,
    store,
    update,
    destroy
};
