/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
	// Deletes ALL existing entries
	await knex('pembayaran').del()
	await knex('pembayaran').insert([
		{ nama_pembayaran: 'Tunggakan', nominal: null, kelas: { kelas: [] } }
	]);
};
