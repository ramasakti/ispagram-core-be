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
			username: 'suartiai007',
			password: await bcrypt.hash('suartiai007', 10),
			email: 'suartiai007@smaispa.sch.id',
			role: 6
		},
		{
			username: 'alfansasmiko',
			password: await bcrypt.hash('alfansasmiko', 10),
			email: 'alfansasmiko@smaispa.sch.id',
			role: 6
		},
		{
			username: 'anikzulifah',
			password: await bcrypt.hash('anikzulifah', 10),
			email: 'anikzulifah@smaispa.sch.id',
			role: 6
		},
		{
			username: 'arifubayd',
			password: await bcrypt.hash('arifubayd', 10),
			email: 'arifubayd@smaispa.sch.id',
			role: 6
		},
		{
			username: 'dewinfs',
			password: await bcrypt.hash('dewinfs', 10),
			email: 'dewinfs@smaispa.sch.id',
			role: 6
		},
		{
			username: 'imamsulbani',
			password: await bcrypt.hash('imamsulbani', 10),
			email: 'imamsulbani@smaispa.sch.id',
			role: 6
		},
		{
			username: 'imroatul',
			password: await bcrypt.hash('imroatul', 10),
			email: 'imroatul@smaispa.sch.id',
			role: 6
		},
		{
			username: 'miftah_faried26',
			password: await bcrypt.hash('miftah_faried26', 10),
			email: 'miftah_faried26@smaispa.sch.id',
			role: 6
		},
		{
			username: 'maskhasila',
			password: await bcrypt.hash('maskhasila', 10),
			email: 'maskhasila@smaispa.sch.id',
			role: 6
		},
		{
			username: 'masridwan',
			password: await bcrypt.hash('masridwan', 10),
			email: 'masridwan@smaispa.sch.id',
			role: 6
		},
		{
			username: 'masfaza',
			password: await bcrypt.hash('masfaza', 10),
			email: 'masfaza@smaispa.sch.id',
			role: 6
		},
		{
			username: 'mochamadrifai52',
			password: await bcrypt.hash('mochamadrifai52', 10),
			email: 'mochamadrifai52@smaispa.sch.id',
			role: 6
		},
		{
			username: 'nasrulhidayat',
			password: await bcrypt.hash('nasrulhidayat', 10),
			email: 'nasrulhidayat@smaispa.sch.id',
			role: 6
		},
		{
			username: 'nenengaliyah79',
			password: await bcrypt.hash('nenengaliyah79', 10),
			email: 'nenengaliyah79@smaispa.sch.id',
			role: 6
		},
		{
			username: 'sitiaminatus',
			password: await bcrypt.hash('sitiaminatus', 10),
			email: 'sitiaminatus@smaispa.sch.id',
			role: 6
		},
		{
			username: 'sudjono',
			password: await bcrypt.hash('sudjono', 10),
			email: 'sudjono@smaispa.sch.id',
			role: 6
		},
		{
			username: 'syamsuddin',
			password: await bcrypt.hash('syamsuddin', 10),
			email: 'syamsuddin@smaispa.sch.id',
			role: 6
		},
		{
			username: 'tutikyuningsih',
			password: await bcrypt.hash('tutikyuningsih', 10),
			email: 'tutikyuningsih@smaispa.sch.id',
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
