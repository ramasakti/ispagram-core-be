/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
	// Deletes ALL existing entries
	await knex('master_category').del()
	await knex('master_category').insert([
		{ id_category: 1, name: 'Prestasi' },
		{ id_category: 2, name: 'Sosial' },
		{ id_category: 3, name: 'Pengumuman' },
		{ id_category: 4, name: 'PPDB' },
		{ id_category: 5, name: 'Alumni' }
	]);
};
