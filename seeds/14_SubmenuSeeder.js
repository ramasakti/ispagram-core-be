/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
	// Deletes ALL existing entries
	await knex('submenu').del()
	await knex('submenu').insert([
		{
			name: 'Item Pembayaran',
			route: '/siswa/keuangan/pembayaran',
			menu_id: 16,
			order: 1
		},
		{
			name: 'Transaksi',
			route: '/siswa/keuangan/transaksi',
			menu_id: 16,
			order: 2
		},
		{
			name: 'Riwayat Transaksi',
			route: '/siswa/keuangan/riwayat',
			menu_id: 16,
			order: 3
		},
		{
			name: 'Jenis Pelanggaran',
			route: '/siswa/kedisiplinan/pelanggaran',
			menu_id: 17,
			order: 3
		},
		{
			name: 'Point Pelanggaran',
			route: '/siswa/kedisiplinan/point',
			menu_id: 17,
			order: 3
		},
	]);
};
