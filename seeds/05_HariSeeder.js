/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
	// Deletes ALL existing entries
	await knex('hari').del()
	const days = [
		{
			nama_hari: 'Senin',
			masuk: '06:50:00',
			pulang: '14:40:00',
			jampel: '00:40:00',
			piket: 'arifubaidillah',
			status: true
		},
		{
			nama_hari: 'Selasa',
			masuk: '06:50:00',
			pulang: '14:40:00',
			jampel: '00:40:00',
			piket: 'arifubaidillah',
			status: true
		},
		{
			nama_hari: 'Rabu',
			masuk: '06:50:00',
			pulang: '14:40:00',
			jampel: '00:40:00',
			piket: 'arifubaidillah',
			status: true
		},
		{
			nama_hari: 'Kamis',
			masuk: '06:50:00',
			pulang: '14:40:00',
			jampel: '00:40:00',
			piket: 'arifubaidillah',
			status: true
		},
		{
			nama_hari: 'Jumat',
			masuk: '06:50:00',
			pulang: '14:40:00',
			jampel: '00:30:00',
			piket: 'arifubaidillah',
			status: true
		},
		{
			nama_hari: 'Sabtu',
			masuk: '06:50:00',
			pulang: '14:40:00',
			jampel: '00:40:00',
			piket: 'arifubaidillah',
			status: true
		},
		{
			nama_hari: 'Minggu', 
			masuk: '00:00:00', 
			pulang: '00:00:00', 
			jampel: '00:00:00', 
			piket: 'arifubaidillah', 
			status: false
		},
	];
	await knex('hari').insert(days);
};
