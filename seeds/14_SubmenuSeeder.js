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
			menu_id: 17,
			order: 1
		},
		{
			name: 'Transaksi',
			route: '/siswa/keuangan/transaksi',
			menu_id: 17,
			order: 2
		},
		{
			name: 'Riwayat Transaksi',
			route: '/siswa/keuangan/riwayat',
			menu_id: 17,
			order: 3
		},
	]);
};
