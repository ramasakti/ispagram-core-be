/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
	// Deletes ALL existing entries
	await knex('role').del()
	await knex('role').insert([
		{
			id_role: 1,
			role: 'Admin',
			description: 'Role User Admin'
		},
		{
			id_role: 2,
			role: 'Engine Absen',
			description: 'Role User Engine Absen'
		},
		{
			id_role: 3,
			role: 'Kurikulum',
			description: 'Role User Waka Kurikulum'
		},
		{
			id_role: 4,
			role: 'Kesiswaan',
			description: 'Role User Waka Kesiswaan'
		},
		{
			id_role: 5,
			role: 'Sarpras',
			description: 'Role User Waka Infrastruktur'
		},
		{
			id_role: 6,
			role: 'Guru',
			description: 'Role User Guru'
		},
		{
			id_role: 7,
			role: 'Siswa',
			description: 'Role User Siswa'
		},
		{
			id_role: 8,
			role: 'Wali Murid',
			description: 'Role User Wali Murid'
		},
	]);
};
