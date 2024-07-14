/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
	// Deletes ALL existing entries
	await knex('guru').del()
	const guru = [
		{
			id_guru: 'arifubayd',
			staf: true,
			nama_guru: 'Arif Ubaidillah',
			alamat: 'Jalan mastrip',
			telp: '085732516082',
			tempat_lahir: 'Surabaya',
			tanggal_lahir: '1986-11-21'
		},
		{
			id_guru: 'ramasakti',
			staf: true,
			nama_guru: 'Rama Sakti Hafidz Fadhilah Aziz, S.Kom',
			alamat: 'Kp. Baru GG H. Kholil Tb. Sumur Waru Sidoarjo',
			telp: '6285157177034',
			tempat_lahir: 'Surabaya',
			tanggal_lahir: '2002-09-27',
		},
	]
	await knex('guru').insert(guru);
	guru.map(async item => await knex('detail_guru').insert({ guru_id: item.id_guru }))
};
