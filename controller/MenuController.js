const db = require('../Config')
const response = require('../Response')
const MenuModel = require('../Model/MenuModel')
const SubmenuModel = require('../Model/SubmenuModel')
const NavbarModel = require('../Model/NavbarModel')

const menu = async (req, res) => {
    try {
        const role = req.params.role
        const data = await MenuModel.getAllMenuWithSectionByRole(role, req.db)

        return response(200, data, `Menu`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const getAllMenu = async (req, res) => {
    try {
        const menu = await MenuModel.getAllMenuWithSection(req.db)
        return response(200, menu, ``, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const getMenuByRole = async (req, res) => {
    try {
        const role = req.params.role
        const menu = await MenuModel.getMenuByRole(role, req.db)
        return response(200, menu, ``, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const store = async (req, res) => {
    try {
        const { name, route, id_section, order } = req.body
        if (!name || !order) return response(400, null, `Form tidak lengkap!`, res)

        await MenuModel.insertMenu({ name, route, section_id: id_section, order }, req.db)
        return response(201, {}, `Berhasil tambah data`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const update = async (req, res) => {
    try {
        const id_menu = req.params.id_menu
        const { name, route, id_section, order } = req.body
        const type = parseInt(req.body.type)

        const detailMenu = await MenuModel.getMenuByID(id_menu, req.db)
        if (!detailMenu) return response(400, null, `Menu tidak ditemukan!`, res)

        switch (type) {
            case 0: // Independent menu
                await MenuModel.updateMenu(id_menu, {
                    type, name, route, section_id: null, order
                }, req.db)
                await SubmenuModel.deleteSubmenuByMenu(id_menu, req.db)
                break;
            case 1: // Menu of section
                await MenuModel.updateMenu(id_menu, {
                    type, name, route, section_id: id_section, order
                }, req.db)
                await SubmenuModel.deleteSubmenuByMenu(id_menu)
                break;
            case 2: // Parent of submenu
                await MenuModel.updateMenu(id_menu, {
                    type, name, route: null, section_id: id_section, order
                }, req.db)
                break;
        }

        return response(201, {}, `Berhasil update menu!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

const destroy = async (req, res) => {
    try {
        const id_menu = req.params.id_menu
        const detailMenu = await MenuModel.getMenuByID(id_menu, req.db)
        if (!detailMenu) return response(400, null, `Menu tidak ditemukan!`, res)

        await NavbarModel.deleteNavbarByMenu(id_menu, req.db)
        await MenuModel.deleteMenu(id_menu, req.db)
        return response(201, {}, `Berhasil delete menu!`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal Server Error!`, res)
    }
}

module.exports = {
    menu,
    getAllMenu,
    getMenuByRole,
    store,
    update,
    destroy
};
