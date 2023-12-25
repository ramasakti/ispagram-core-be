/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
	// Deletes ALL existing entries
	await knex('navbar').del()
	const menus = await knex('menu')
	for (const menu of menus) {
		await knex('navbar').insert([
			{
				menu_id: menu.id_menu,
				role_id: 1
			}
		]);
	}
};
