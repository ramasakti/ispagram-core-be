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
			diniyah: true,
			jam_diniyah: { mulai: '06:50:00', sampai: '08:00:00' },
			masuk: '06:50:00',
			"istirahat": JSON.stringify([
				{ mulai: '09:20:00', selesai: '10:00:00' },
				{ mulai: '11:20:00', selesai: '11:50:00' }
			]),
			pulang: '14:40:00', jampel: '00:40:00',
			piket: 'syamsuddin',
			status: true
		},
		{
			nama_hari: 'Selasa',
			diniyah: true,
			jam_diniyah: { mulai: '06:50:00', sampai: '08:00:00' },
			masuk: '06:50:00',
			"istirahat": JSON.stringify([
				{ mulai: '09:20:00', selesai: '10:00:00' },
				{ mulai: '11:20:00', selesai: '11:50:00' }
			]),
			pulang: '14:40:00',
			jampel: '00:40:00',
			piket: 'sitiaminatus',
			status: true
		},
		{
			nama_hari: 'Rabu',
			diniyah: true,
			jam_diniyah: { mulai: '06:50:00', sampai: '08:00:00' },
			masuk: '06:50:00',
			"istirahat": JSON.stringify([
				{ mulai: '09:20:00', selesai: '10:00:00' },
				{ mulai: '11:20:00', selesai: '11:50:00' }
			]),
			pulang: '14:40:00',
			jampel: '00:40:00',
			piket: 'nasrulhidayat',
			status: true
		},
		{
			nama_hari: 'Kamis',
			diniyah: true,
			jam_diniyah: { mulai: '06:50:00', sampai: '08:00:00' },
			masuk: '06:50:00',
			"istirahat": JSON.stringify([
				{ mulai: '09:20:00', selesai: '10:00:00' },
				{ mulai: '11:20:00', selesai: '11:50:00' }
			]),
			pulang: '14:40:00',
			jampel: '00:40:00',
			piket: 'masfaza',
			status: true
		},
		{
			nama_hari: 'Jumat',
			diniyah: false,
			masuk: '06:50:00',
			"istirahat": JSON.stringify([
				{ mulai: '09:30:00', selesai: '09:50:00' },
			]),
			pulang: '14:40:00',
			jampel: '00:40:00',
			piket: 'imroatul',
			status: true
		},
		{
			nama_hari: 'Sabtu',
			diniyah: false,
			masuk: '06:50:00',
			"istirahat": JSON.stringify([
				{ mulai: '09:30:00', selesai: '09:50:00' },
			]),
			pulang: '14:40:00',
			jampel: '00:40:00',
			piket: 'anikzulifah',
			status: true
		},
		{
			nama_hari: 'Minggu', diniyah: false, masuk: '06:50:00', pulang: '14:40:00', jampel: '00:40:00', piket: 'arifubayd', status: false
		},
	];
	await knex('hari').insert(days);
};
