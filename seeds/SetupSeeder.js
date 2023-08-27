/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const bcrypt = require('bcryptjs')

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('user').del();
  await knex('guru').del();
  await knex('kelas').del();
  await knex('hari').del();
  await knex('nominal').del();
  await knex('transportasi').del();
  await knex('jenis_tinggal').del();
  await knex('profesi').del();
  await knex('pendidikan').del();
  await knex('pembayaran').del();

  // Inserts seed entries for 'user' table
  await knex('user').insert([
    {
      username: 'ramasakti27',
      password: await bcrypt.hash('ramasakti27', 10),
      name: 'Rama Sakti Hafidz FA',
      email: 'ramasakti1337@gmail.com',
      avatar: '',
      role: 'Admin'
    },
    {
      username: 'arifubayd',
      password: await bcrypt.hash('arifubayd', 10),
      name: 'Arif Ubaidillah, S.Si',
      avatar: '',
      role: 'Admin'
    },
    {
      username: 'adminabsen',
      password: await bcrypt.hash('parlaungan1980', 10),
      avatar: '',
      role: 'Admin'
    },
  ]);

  // Inserts seed entries for 'guru' table
  await knex('guru').insert([
    {
      id_guru: 'ramasakti27',
      nama_guru: 'Rama Sakti Hafidz FA',
      alamat: 'Jl. Kampung Malang Kulon V Surabaya',
      telp: '6285157177034',
      tempat_lahir: 'Surabaya',
      tanggal_lahir: '2002-09-27'
    },
    {
      id_guru: 'arifubayd',
      nama_guru: 'Arif Ubaidillah, S.Si',
      alamat: 'Kepuh Kiriman Dalam Waru Sidoarjo',
      telp: '+62 838-5255-1917',
      tempat_lahir: 'Surabaya',
      tanggal_lahir: '1986-11-21'
    }
  ]);

  // Insert seed entries for 'kelas' table
  await knex('kelas').insert([
    { tingkat: 'XII', jurusan: 'SP 2021 1', walas: 'arifubayd' },
    { tingkat: 'XII', jurusan: 'SP 2021 2', walas: 'arifubayd' },
    { tingkat: 'XI', jurusan: 'SP 2022 1', walas: 'arifubayd' },
    { tingkat: 'XI', jurusan: 'SP 2022 2', walas: 'arifubayd' },
    { tingkat: 'X', jurusan: 'SP 2023 1', walas: 'arifubayd' },
    { tingkat: 'X', jurusan: 'SP 2023 2', walas: 'arifubayd' },
  ]);

  // Insert seed entries for 'hari' table
  const days = [
    { nama_hari: 'Senin', masuk: '06:50:00', pulang: '14:40:00', jampel: '00:40:00', piket: 'arifubayd', status: true },
    { nama_hari: 'Selasa', masuk: '06:50:00', pulang: '14:40:00', jampel: '00:40:00', piket: 'arifubayd', status: true },
    { nama_hari: 'Rabu', masuk: '06:50:00', pulang: '14:40:00', jampel: '00:40:00', piket: 'arifubayd', status: true },
    { nama_hari: 'Kamis', masuk: '06:50:00', pulang: '14:40:00', jampel: '00:40:00', piket: 'arifubayd', status: true },
    { nama_hari: 'Jumat', masuk: '06:30:00', pulang: '14:40:00', jampel: '00:40:00', piket: 'arifubayd', status: true },
    { nama_hari: 'Sabtu', masuk: '06:30:00', pulang: '14:40:00', jampel: '00:40:00', piket: 'arifubayd', status: true },
    { nama_hari: 'Minggu', masuk: '06:50:00', pulang: '14:40:00', jampel: '00:40:00', piket: 'arifubayd', status: false },
  ];
  await knex('hari').insert(days);

  // Insert seed entries for 'nominal' table
  await knex('nominal').insert([
    { jenis: 'Mengajar', harga: 33000 },
    { jenis: 'Transport', harga: 5000 },
  ]);

  // Insert seed entries for 'transportasi' table
  const transports = [
    { transport: 'Jalan Kaki' },
    { transport: 'Sepeda' },
    { transport: 'Sepeda Motor' },
    { transport: 'Antar Jemput' },
    { transport: 'Transportasi Umum (Ojek Online/Bus/Angkot/KRL)' },
  ];
  await knex('transportasi').insert(transports);

  // Insert seed entries for 'jenis_tinggal' table
  const jenisTinggal = [
    { jeting: 'Bersama Orang Tua' },
    { jeting: 'Bersama Kakek/Nenek/Kerabat' },
    { jeting: 'Pondok Pesantren' },
    { jeting: 'Kos / Kontrak Sendiri' },
  ];
  await knex('jenis_tinggal').insert(jenisTinggal);

  // Insert seed entries for 'profesi' table
  const profesis = [
    { profesi: 'Karyawan Swasta' },
    { profesi: 'Nelayan' },
    { profesi: 'Petani' },
    { profesi: 'Peternak' },
    { profesi: 'PNS/TNI/Polri' },
    { profesi: 'Pedagang' },
    { profesi: 'Wiraswasta ([Usaha] Warung Kopi/Penyetan/Bakso/dll)' },
    { profesi: 'Wirausaha ([Usaha] Distributor/Produsen/Agen/dll)' },
    { profesi: 'Pensiunan' },
    { profesi: 'TKI / TKW' },
    { profesi: 'Freelance / Serabutan' },
    { profesi: 'Tidak Berkerja / Sakit / Ibu Rumah Tangga' },
    { profesi: 'Sudah Meninggal' },
  ];
  await knex('profesi').insert(profesis);

  // Insert seed entries for 'pendidikan' table
  const pendidikans = [
    { pendidikan: 'SD Sederajat / Paket A' },
    { pendidikan: 'SMP Sederajat / Paket B' },
    { pendidikan: 'SMA Sederajat / Paket C' },
    { pendidikan: 'S1' },
    { pendidikan: 'S2' },
    { pendidikan: 'S3' },
  ];
  await knex('pendidikan').insert(pendidikans);

  // Insert seed entries for 'pembayaran' table
  await knex('pembayaran').insert([
    { nama_pembayaran: 'Tunggakan', nominal: null, kelas: '' },
    // Insert other 'pembayaran' entries here...
  ]);
};
