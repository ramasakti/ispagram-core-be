/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
	// Deletes ALL existing entries
	await knex('access').del()
	const permissions = await knex('permission')
	const menus = await knex('menu')
	for (const menu of menus) {
		for (const permission of permissions) {
			await knex('access').insert({
				permission_id: permission.id_permission,
				menu_id: menu.id_menu,
				role_id: 1,
			})
		}
	}
};
