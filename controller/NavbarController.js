const response = require('../Response')
const NavbarModel = require('../Model/NavbarModel')
const jwt = require('jsonwebtoken')

const formatNavbarData = (navbarData, submenuData, users) => {    
    const formattedData = [];

    const sectionMap = new Map();

    navbarData.forEach((row) => {
        const { section_name, section_icon, menu_name, menu_route, id_menu } = row;

        if (!sectionMap.has(section_name)) {
            sectionMap.set(section_name, {
                section: section_name,
                icon: section_icon,
                menu: [],
            });
        }

        // Replace <username> in menu_route with the value from 'users' parameter
        const menuRouteWithUser = menu_route ? `/dashboard${menu_route.replace('<username>', users.userId ?? '')}` : (menu_route === '') && `/dashboard`;

        const menuObject = {
            menu_name,
            route: menuRouteWithUser,
            submenu: [],
        };

        const relatedSubmenus = submenuData.filter((submenu) => submenu.menu_id === id_menu);

        if (relatedSubmenus.length > 0) {
            relatedSubmenus.forEach((submenu) => {
                // Replace <username> in submenu_route with the value from 'users' parameter
                const submenuRouteWithUser = `/dashboard${submenu.route.replace('<username>', users.userId ?? '')}`;
                menuObject.submenu.push({
                    submenu: submenu.name,
                    submenu_route: submenuRouteWithUser,
                });
            });
        }

        sectionMap.get(section_name).menu.push(menuObject);
    });

    for (const value of sectionMap.values()) {
        formattedData.push(value);
    }

    return formattedData;
}

const navbar = async (req, res) => {
    try {
        const role = req.params.role;
        const navbarData = await NavbarModel.getNavbarByRole(role, req.db);
        const submenuData = await NavbarModel.getSubmenu(req.db);
        let users = ''

        const token = req.headers['authorization'].replace('Bearer ', '')
        jwt.verify(token, 'parlaungan1980', (err, user) => {
            users = user
        })
        
        const formattedNavbarData = formatNavbarData(navbarData, submenuData, users ?? '');

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
            await NavbarModel.insertNavbar({ menu_id: menu, role_id: role }, req.db)
        }else{
            await NavbarModel.deleteNavbarByMenuAndRole(menu, role, req.db)
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