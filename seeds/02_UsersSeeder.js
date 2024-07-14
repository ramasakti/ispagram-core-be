/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const bcrypt = require('bcryptjs')
exports.seed = async function (knex) {
	// Deletes ALL existing entries
	await knex('users').del()
	const users = [
		{
			username: 'arifubaidillah',
			password: await bcrypt.hash('arifubaidillah', 10),
			email: 'arekraden2005@gmail.com',
			role: 6
		},
		{
			username: 'ramasakti',
			password: await bcrypt.hash('Ramasakti123*', 10),
			email: 'ramasakti1337@gmail.com',
			role: 1
		},
	]
	await knex('users').insert(users);
};
