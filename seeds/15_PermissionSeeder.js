/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
	// Deletes ALL existing entries
	await knex('permission').del()
	await knex('permission').insert([
		{
			id_permission: 1,
			name: 'View',
			description: 'Akses Untuk Melihat Data'
		},
		{
			id_permission: 2,
			name: 'Create',
			description: 'Akses Untuk Menambah Data'
		},
		{
			id_permission: 3,
			name: 'Edit',
			description: 'Akses Untuk Mengubah Data'
		},
		{
			id_permission: 4,
			name: 'Delete',
			description: 'Akses Untuk Menghapus Data'
		},
	]);
};
