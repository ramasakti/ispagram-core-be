/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
	await knex('whatsapp').del()
	await knex('whatsapp').insert([
		{ id_whatsapp: 1, nomor: '62', token: '', name: 'SMA Islam Parlaungan Sidoarjo' }
	]);
};
