/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
	// Deletes ALL existing entries
	await knex('guru').del()
	const guru = [
		{
			id_guru: 'suartiai007',
			staf: false,
			nama_guru: 'Ai Suarti',
			alamat: 'Berbek IH / 1 B',
			telp: '087702896272',
			tempat_lahir: 'Bandung',
			tanggal_lahir: '1970-04-05'
		},
		{
			id_guru: 'alfansasmiko',
			staf: false,
			nama_guru: 'Alfan Sasmiko Putra',
			alamat: 'DUKUH PAKIS 5/4',
			telp: '081235605030',
			tempat_lahir: 'SURABAYA',
			tanggal_lahir: '1978-09-08'
		},
		{
			id_guru: 'anikzulifah',
			staf: false,
			nama_guru: 'Anik Zulifah',
			alamat: 'Tropodo Tamasa',
			telp: '087894790592',
			tempat_lahir: 'Sidoarjo',
			tanggal_lahir: '1979-09-08'
		},
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
			id_guru: 'dewinfs',
			staf: false,
			nama_guru: 'DEWI NUR FAIZATUS SAYYIDAH',
			alamat: 'NGEMPLAK SEMAMPIR SEDATI',
			telp: '082142601807',
			tempat_lahir: 'SIDOARJO',
			tanggal_lahir: '1994-04-19'
		},
		{
			id_guru: 'imamsulbani',
			staf: false,
			nama_guru: 'Imam Sulbani',
			alamat: 'JL. TAMBAK OSO 53 SIDOARJO',
			telp: '082230342929',
			tempat_lahir: 'SIDOARJO',
			tanggal_lahir: '1974-12-10'
		},
		{
			id_guru: 'imroatul',
			staf: false,
			nama_guru: 'IMROATUL WAHIDAH',
			alamat: 'BERBEK WARU SIDOARJO',
			telp: '081554556144',
			tempat_lahir: 'SIDOARJO',
			tanggal_lahir: '1992-12-30'
		},
		{
			id_guru: 'miftah_faried26',
			staf: false,
			nama_guru: 'M. Miftah Faried',
			alamat: 'Tambak Rejo No.22',
			telp: '081359619008',
			tempat_lahir: 'Banjarmasin',
			tanggal_lahir: '1985-04-26'
		},
		{
			id_guru: 'maskhasila',
			staf: false,
			nama_guru: 'Mas Hasila Imani',
			alamat: 'Jl. Berbek I No. 10',
			telp: '089686904169',
			tempat_lahir: 'Sidoarjo',
			tanggal_lahir: '1998-03-16'
		},
		{
			id_guru: 'masridwan',
			staf: false,
			nama_guru: 'Mas Mohammad Ridwan',
			alamat: 'jl. berbek I No.10',
			telp: '085746874424',
			tempat_lahir: 'surabaya',
			tanggal_lahir: '1990-06-22'
		},
		{
			id_guru: 'masfaza',
			staf: false,
			nama_guru: 'MASFAZA NABILAH',
			alamat: 'Jl. Berbek IA RT.03 RW.01',
			telp: '087765634942',
			tempat_lahir: 'SURABAYA',
			tanggal_lahir: '2001-01-01'
		},
		{
			id_guru: 'mochamadrifai52',
			staf: false,
			nama_guru: 'Mochamad Hasan Rifai',
			alamat: 'Dsn. Mojolegi',
			telp: '085648453532',
			tempat_lahir: 'Jombang',
			tanggal_lahir: '1988-02-15'
		},
		{
			id_guru: 'nasrulhidayat',
			staf: false,
			nama_guru: 'MOCHAMMAD NASRUL HIDAYAT',
			alamat: 'Panjunan RT 02 RW 03 Kepuh Kiriman Sidoarjo',
			telp: '085733574272',
			tempat_lahir: 'SIDOARJO',
			tanggal_lahir: '1995-10-16'
		},
		{
			id_guru: 'nenengaliyah79',
			staf: false,
			nama_guru: 'NENENG NURUL ALIYAH',
			alamat: 'JL.KH.ALI RT 05/03/12A TAMBAK SUMUR',
			telp: '085812704244',
			tempat_lahir: 'SIDOARJO',
			tanggal_lahir: '1979-04-02'
		},
		{
			id_guru: 'sitiaminatus',
			staf: false,
			nama_guru: 'SITI AMINATUS SHOLICHAH',
			alamat: 'BERBEK WARU SIDOARJO',
			telp: '082324052337',
			tempat_lahir: 'SURABAYA',
			tanggal_lahir: '2000-09-12'
		},
		{
			id_guru: 'sudjono',
			staf: false,
			nama_guru: 'Sudjono',
			alamat: 'JL KH. Nawawi',
			telp: '085731133326',
			tempat_lahir: 'SIDOARJO',
			tanggal_lahir: '1963-04-08'
		},
		{
			id_guru: 'syamsuddin',
			staf: false,
			nama_guru: 'Syamsuddin',
			alamat: 'JL. BREBEK I/F No. 4 SIDOARJO',
			telp: '085732684788',
			tempat_lahir: 'SIDOARJO',
			tanggal_lahir: '1972-05-25'
		},
		{
			id_guru: 'tutikyuningsih',
			staf: false,
			nama_guru: 'TUTIK YUNINGSIH, S.Pd.',
			alamat: 'ALUN ALUN BANGUNSARI DUPAK KREMBANGAN SURABAYA',
			telp: '085850464469',
			tempat_lahir: 'JAKARTA',
			tanggal_lahir: '1977-03-11'
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
