/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
	// Deletes ALL existing entries
	await knex('mapel').del()
	await knex('mapel').insert([
		{ nama_mapel: "Pendidikan Agama Islam dan Budi Pekerti" },
		{ nama_mapel: "Pendidikan Pancasila" },
		{ nama_mapel: "Project Penguatan Profil Pelajar Pancasila" },
		{ nama_mapel: "Bahasa Indonesia" },
		{ nama_mapel: "Bahasa Inggris" },
		{ nama_mapel: "Matematika (Umum)" },
		{ nama_mapel: "Sejarah" },
		{ nama_mapel: "Pendidikan Jasmani, Olahraga, dan Kesehatan" },
		{ nama_mapel: "Seni dan Budaya" },
		{ nama_mapel: "Prakarya dan Kewirausahaan" },
		{ nama_mapel: "Muatan Lokal Bahasa Daerah" },
		{ nama_mapel: "Ekonomi" },
		{ nama_mapel: "Sosiologi" },
		{ nama_mapel: "Geografi" },
		{ nama_mapel: "Kimia" },
		{ nama_mapel: "Fisika" },
		{ nama_mapel: "Biologi" },
		{ nama_mapel: "Informatika" },
		{ nama_mapel: "Bimbingan dan Konseling/Konselor (BP/BK)" },
	]);
};
