const response = require('../Response')
const NavbarModel = require('../Model/NavbarModel')

const formatNavbarData = (navbarData, submenuData) => {
    const formattedData = [];

    const sectionMap = new Map();

    navbarData.forEach((row) => {
        const { section_name, section_icon, menu_name, menu_route, id_menu, role } = row;

        if (!sectionMap.has(section_name)) {
            sectionMap.set(section_name, {
                section: section_name,
                icon: section_icon,
                menu: [],
            });
        }

        const menuObject = {
            menu_name,
            route: menu_route ? `/dashboard${menu_route}` : (menu_route === '') && `/dashboard`,
            submenu: [],
        };

        const relatedSubmenus = submenuData.filter((submenu) => submenu.menu_id === id_menu);

        if (relatedSubmenus.length > 0) {
            relatedSubmenus.forEach((submenu) => {
                menuObject.submenu.push({
                    submenu: submenu.name,
                    submenu_route: `/dashboard${submenu.route}`,
                });
            });
        }

        sectionMap.get(section_name).menu.push(menuObject);
    });

    for (const value of sectionMap.values()) {
        formattedData.push(value);
    }

    return formattedData;
};

const navbar = async (req, res) => {
    try {
        const role = req.params.role;
        const navbarData = await NavbarModel.getNavbarByRole(role);
        const submenuData = await NavbarModel.getSubmenu();

        const formattedNavbarData = formatNavbarData(navbarData, submenuData);

        return response(200, formattedNavbarData, `Navbars`, res);
    } catch (error) {
        console.error('Error fetching navbar data:', error);
        return response(500, {}, 'Internal server error', res);
    }
}

const update = async (req, res) => {
    try {
        const { role } = req.params
        const { access, menu } = req.body

        if (access) {
            await NavbarModel.insertNavbar({ menu_id: menu, role_id: role })
        }else{
            await NavbarModel.deleteNavbarByMenuAndRole(menu, role)
        }

        return response(201, {}, `Berhasil ${access ? 'tambah akses' : 'delete akses'} navbar`, res)
    } catch (error) {
        console.error('Error fetching navbar data:', error);
        return response(500, {}, 'Internal server error', res);
    }
}

module.exports = {
    navbar,
    update
};