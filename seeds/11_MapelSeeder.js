/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
	// Deletes ALL existing entries
	await knex('mapel').del()
	await knex('mapel').insert([
		{
			name: 'Pendidikan Agama Islam',
			kelas_id: 1
		},
		{
			name: 'Pendidikan Agama Islam',
			kelas_id: 2
		},
		{
			name: 'Pendidikan Agama Islam',
			kelas_id: 3
		},
		{
			name: 'Pendidikan Agama Islam',
			kelas_id: 4
		},
		{
			name: 'Pendidikan Agama Islam',
			kelas_id: 5
		},
	]);
};
