/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
	// Deletes ALL existing entries
	await knex('menu').del()
	await knex('menu').insert([
		{
			name: 'Dashboard',
			type: 0,
			route: '',
			order: 1,
		},
		{
			name: 'Section',
			type: 1,
			route: '/web/section',
			section_id: 1,
			order: 1
		},
		{
			name: 'Menu',
			type: 1,
			route: '/web/menu',
			section_id: 1,
			order: 2
		},
		{
			name: 'Submenu',
			type: 1,
			route: '/web/submenu',
			section_id: 1,
			order: 3
		},
		{
			name: 'User Access Setting',
			type: 1,
			route: '/web/access',
			section_id: 1,
			order: 4
		},
		{
			name: 'Home Page',
			type: 1,
			route: '/web/home',
			section_id: 1,
			order: 5
		},
		{
			name: 'Artikel',
			type: 1,
			route: '/web/blog',
			section_id: 1,
			order: 6
		},
		{
			name: 'Users',
			type: 0,
			route: '/users',
			order: 2
		},
		{
			name: 'Jam Masuk & Piket',
			type: 1,
			route: '/sekolah/masuk',
			section_id: 2,
			order: 1
		},
		{
			name: 'Jam Pelajaran',
			type: 1,
			route: '/sekolah/jampel',
			section_id: 2,
			order: 2
		},
		{
			name: 'Libur',
			type: 1,
			route: '/sekolah/libur',
			section_id: 2,
			order: 3
		},
		{
			name: 'Kelas',
			type: 1,
			route: '/siswa/kelas',
			section_id: 3,
			order: 1
		},
		{
			name: 'Data Siswa',
			type: 1,
			route: '/siswa/data',
			section_id: 3,
			order: 2
		},
		{
			name: 'Absen Siswa',
			type: 1,
			route: '/siswa/absen',
			section_id: 3,
			order: 3
		},
		{
			name: 'Rekap Absen Siswa',
			type: 1,
			route: '/siswa/rekap',
			section_id: 3,
			order: 4
		},
		{
			name: 'Keuangan Siswa',
			type: 2,
			section_id: 3,
			order: 5
		},
		{
			name: 'Point Kedisiplinan',
			type: 2,
			section_id: 3,
			order: 6
		},
		{
			name: 'Data Guru',
			type: 1,
			route: '/guru/data',
			section_id: 4,
			order: 1
		},
		{
			name: 'Jurnal Mengajar Guru',
			type: 1,
			route: '/guru/jurnal',
			section_id: 4,
			order: 2
		},
		{
			name: 'Absen Staf',
			type: 2,
			route: '/guru/staf',
			section_id: 4,
			order: 3
		},
		{
			name: 'Mata Pelajaran',
			type: 1,
			route: '/akademik/mapel',
			section_id: 5,
			order: 1
		},
		{
			name: 'Jadwal Pelajaran',
			type: 1,
			route: '/akademik/jadwal',
			section_id: 5,
			order: 2
		},
		{
			name: 'Jurnal Kelas',
			type: 1,
			route: '/akademik/jurnal',
			section_id: 5,
			order: 3
		},
		{
			name: 'WhatsApp Broadcaster',
			type: 1,
			route: '/app/whatsapp',
			section_id: 6,
			order: 1
		},
		{
			name: 'Arsip Berkas',
			type: 1,
			route: '#',
			section_id: 6,
			order: 2
		},
		{
			name: 'Pengumuman Kelulusan',
			type: 1,
			route: '#',
			section_id: 6,
			order: 3
		},
		{
			name: 'E Library',
			type: 1,
			route: '#',
			section_id: 6,
			order: 5
		},
		{
			name: 'BK Center',
			type: 1,
			route: '#',
			section_id: 6,
			order: 6
		},
		{
			name: 'Data',
			type: 1,
			route: '/alumni/data',
			section_id: 7,
			order: 1
		},
		{
			name: 'Transaksi',
			type: 1,
			route: '/alumni/transaksi',
			section_id: 7,
			order: 2
		},
		{
			name: 'Gedung',
			type: 1,
			route: '/sarpras/gedung',
			section_id: 8,
			order: 1
		},
		{
			name: 'Ruang',
			type: 1,
			route: '/sarpras/ruang',
			section_id: 8,
			order: 2
		},
		{
			name: 'Inventaris',
			type: 1,
			route: '/sarpras/inventaris',
			section_id: 8,
			order: 3
		},
	]);
};
