/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const bcrypt = require('bcryptjs')
exports.seed = async function (knex) {
	// Deletes ALL existing entries
	await knex('users').del()
	await knex('users').insert([
		{
			username: 'admin',
			password: await bcrypt.hash('ispagram1980', 10),
			email: 'admin@smaispa.sch.id',
			role: 1
		},
		{
			username: 'ramasakti',
			password: await bcrypt.hash('Ramasakti123*', 10),
			email: 'ramasakti1337@gmail.com',
			role: 1
		},
		{
			username: 'arifubaidillah',
			password: await bcrypt.hash('arifubaidillah', 10),
			email: 'ramasaktislav@gmail.com',
			role: 4
		},
	]);
};
