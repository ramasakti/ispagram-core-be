/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
	// Deletes ALL existing entries
	await knex('guru').del()
	await knex('guru').insert([
		{
			id_guru: 'ramasakti',
			staf: true,
			nama_guru: 'Rama Sakti Hafidz Fadhilah Aziz, S.Kom',
			alamat: 'Kp. Baru GG H. Kholil Tb. Sumur Waru Sidoarjo',
			telp: '6285157177034',
			tempat_lahir: 'Surabaya',
			tanggal_lahir: '2002-09-27',
		},
		{
			id_guru: 'arifubaidillah',
			staf: true,
			nama_guru: 'Arif Ubaidillah, S.Si',
			alamat: 'Kepuh Kiriman Dalam Masjid Waru Sidoarjo',
			telp: '+62 838-5255-1917',
			tempat_lahir: 'Surabaya',
			tanggal_lahir: '1986-11-21',
		},
	]);
};
