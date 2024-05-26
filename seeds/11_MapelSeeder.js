/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
	// Deletes ALL existing entries
	await knex('mapel').del()
	const kelas = await knex('kelas')
	kelas.map(async item => {
		await knex('mapel').insert([
			{ nama_mapel: "Pendidikan Agama Islam dan Budi Pekerti", kelas_id: item.id_kelas },
			{ nama_mapel: "Pendidikan Pancasila", kelas_id: item.id_kelas },
			{ nama_mapel: "Project Penguatan Profil Pelajar Pancasila", kelas_id: item.id_kelas },
			{ nama_mapel: "Bahasa Indonesia", kelas_id: item.id_kelas },
			{ nama_mapel: "Bahasa Inggris", kelas_id: item.id_kelas },
			{ nama_mapel: "Matematika (Umum)", kelas_id: item.id_kelas },
			{ nama_mapel: "Sejarah", kelas_id: item.id_kelas },
			{ nama_mapel: "Pendidikan Jasmani, Olahraga, dan Kesehatan", kelas_id: item.id_kelas },
			{ nama_mapel: "Seni dan Budaya", kelas_id: item.id_kelas },
			{ nama_mapel: "Prakarya dan Kewirausahaan", kelas_id: item.id_kelas },
			{ nama_mapel: "Muatan Lokal Bahasa Daerah", kelas_id: item.id_kelas },
			{ nama_mapel: "Ekonomi", kelas_id: item.id_kelas },
			{ nama_mapel: "Sosiologi", kelas_id: item.id_kelas },
			{ nama_mapel: "Geografi", kelas_id: item.id_kelas },
			{ nama_mapel: "Kimia", kelas_id: item.id_kelas },
			{ nama_mapel: "Fisika", kelas_id: item.id_kelas },
			{ nama_mapel: "Biologi", kelas_id: item.id_kelas },
			{ nama_mapel: "Informatika", kelas_id: item.id_kelas },
			{ nama_mapel: "Bimbingan dan Konseling/Konselor (BP/BK)", kelas_id: item.id_kelas },
		]);
	})
};
