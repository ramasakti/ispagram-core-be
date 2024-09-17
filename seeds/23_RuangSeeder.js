/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
	// Deletes ALL existing entries
	await knex('ruang').del()
	await knex('ruang').insert([
		{
			id_ruang: 1,
			kode_ruang: '101',
			nama_ruang: 'R. Kaprodi Informatika',
			lantai: 1,
			panjang: 5,
			lebar: 10
		},
		{
			id_ruang: 2,
			kode_ruang: '201',
			nama_ruang: 'R. Informatika A1',
			lantai: 2,
			panjang: 5,
			lebar: 10
		},
		{
			id_ruang: 3,
			kode_ruang: '301',
			nama_ruang: 'R. Informatika A2',
			lantai: 3,
			panjang: 5,
			lebar: 10
		}
	]);
};
