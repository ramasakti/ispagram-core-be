/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const bcrypt = require('bcryptjs')
const moment = require('../utilities/moment')

exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('user').del();
    await knex('hari').del();
    await knex('kelas').del();
    await knex('guru').del();
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
            name: 'Mesin Absen',
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
        { tingkat: 'XII', jurusan: 'Utsman bin Affan', walas: 'arifubayd' },
        { tingkat: 'XII', jurusan: 'Ali bin Abi Thalib', walas: 'arifubayd' },
        { tingkat: 'XI', jurusan: 'Abu Bakar ash-Shiddiq', walas: 'arifubayd' },
        { tingkat: 'XI', jurusan: 'Umar bin Khattab', walas: 'arifubayd' },
        { tingkat: 'X', jurusan: 'Hasan bin Ali', walas: 'arifubayd' },
        { tingkat: 'X', jurusan: 'SP 2023 2', walas: 'arifubayd' },
    ]);

    // Insert seed entries for 'hari' table
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
            piket: 'arifubayd',
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
            piket: 'arifubayd',
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
            piket: 'arifubayd',
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
            piket: 'arifubayd',
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
            piket: 'arifubayd',
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
            piket: 'arifubayd',
            status: true
        },
        {
            nama_hari: 'Minggu', diniyah: false, masuk: '06:50:00', pulang: '14:40:00', jampel: '00:40:00', piket: 'arifubayd', status: false
        },
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
        { nama_pembayaran: 'Tunggakan', nominal: null, kelas: { kelas: [] } },
    ]);

    // Menu Seeder
    const dataMenuSeeder = [
        {
            menu: JSON.stringify([
                {
                    name: 'Dashboard',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l-2 0l9 -9l9 9l-2 0" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" /></svg>`,
                    route: '/admin',
                },
                {
                    name: 'Web Setting',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tablerWorld" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
                <path d="M3.6 9h16.8"></path>
                <path d="M3.6 15h16.8"></path>
                <path d="M11.5 3a17 17 0 0 0 0 18"></path>
                <path d="M12.5 3a17 17 0 0 1 0 18"></path>
            </svg>`,
                    route: '#',
                    child: [
                        {
                            name: 'Menu Setting',
                            route: '/admin/web/menu',
                        },
                        {
                            name: 'Home Page',
                            route: '/admin/web/home',
                        },
                        {
                            name: 'Blog',
                            route: '/admin/web/blog',
                        },
                        {
                            name: 'Galeri',
                            route: '/admin/web/galeri',
                        },
                    ]
                },
                {
                    name: 'Users',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-users" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
            </svg>`,
                    route: '/admin/users',
                },
                {
                    name: 'Sekolah',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-bell-school" width="24" height="24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M10 10m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0"></path>
                    <path d="M13.5 15h.5a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-1a2 2 0 0 1 2 -2h.5"></path>
                    <path d="M16 17a5.698 5.698 0 0 0 4.467 -7.932l-.467 -1.068"></path>
                    <path d="M10 10v.01"></path>
                    <path d="M20 8m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                 </svg>`,
                    route: '#',
                    child: [
                        {
                            name: 'Jam Masuk & Piket',
                            route: '/admin/sekolah/masuk',
                        },
                        {
                            name: 'Jam Pelajaran',
                            route: '/admin/sekolah/jampel',
                        },
                        {
                            name: 'Libur',
                            route: '/admin/sekolah/libur',
                        }
                    ]
                },
                {
                    name: 'Siswa',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-school" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M22 9l-10 -4l-10 4l10 4l10 -4v6"></path>
                <path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4"></path>
            </svg>`,
                    route: '#',
                    child: [
                        {
                            name: 'Kelas',
                            route: '/admin/siswa/kelas',
                        },
                        {
                            name: 'Data Siswa',
                            route: '/admin/siswa/data',
                        },
                        {
                            name: 'Absensi Siswa',
                            route: '/admin/siswa/absen',
                        },
                        {
                            name: 'Rekap Absensi Siswa',
                            route: '/admin/siswa/rekap',
                        },
                        {
                            name: 'Keuangan Siswa',
                            route: '#',
                            child: [
                                {
                                    name: 'Item Pembayaran',
                                    route: '/admin/siswa/keuangan/pembayaran',
                                },
                                {
                                    name: 'Riwayat Transaksi',
                                    route: '/admin/siswa/keuangan/riwayat',
                                },
                                {
                                    name: 'Transaksi',
                                    route: '/admin/siswa/keuangan/transaksi',
                                },
                            ]
                        }
                    ]
                },
                {
                    name: 'Guru',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-user-star" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                <path d="M6 21v-2a4 4 0 0 1 4 -4h.5"></path>
                <path d="M17.8 20.817l-2.172 1.138a.392 .392 0 0 1 -.568 -.41l.415 -2.411l-1.757 -1.707a.389 .389 0 0 1 .217 -.665l2.428 -.352l1.086 -2.193a.392 .392 0 0 1 .702 0l1.086 2.193l2.428 .352a.39 .39 0 0 1 .217 .665l-1.757 1.707l.414 2.41a.39 .39 0 0 1 -.567 .411l-2.172 -1.138z"></path>
            </svg>`,
                    route: '#',
                    child: [
                        {
                            name: 'Data Guru',
                            route: '/admin/guru/data',
                        },
                        {
                            name: 'Keuangan Guru',
                            route: '/admin/guru/keuangan',
                        },
                    ]
                },
                {
                    name: 'Akademik',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chalkboard" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M8 19h-3a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v11a1 1 0 0 1 -1 1"></path>
                <path d="M11 16m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
            </svg>`,
                    route: '#',
                    child: [
                        {
                            name: 'Jadwal Pelajaran',
                            route: '/admin/akademik/jadwal'
                        },
                        {
                            name: 'Jurnal Kelas',
                            route: '/admin/akademik/jurnal'
                        }
                    ]
                }
            ]),
            role: 'Admin'
        },
        {
            menu: JSON.stringify([
                {
                    name: 'Dashboard',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l-2 0l9 -9l9 9l-2 0" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" /></svg>`,
                    route: '/guru',
                },
                {
                    name: 'Jadwal Mengajar',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-calendar-time" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M11.795 21h-6.795a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4"></path>
                    <path d="M18 18m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                    <path d="M15 3v4"></path>
                    <path d="M7 3v4"></path>
                    <path d="M3 11h16"></path>
                    <path d="M18 16.496v1.504l1 1"></path>
                 </svg>`,
                    route: '/guru/mengajar'
                }
            ]),
            role: 'Guru'
        },
        {
            menu: JSON.stringify([
                {
                    name: 'Dashboard',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l-2 0l9 -9l9 9l-2 0" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" /></svg>`,
                    route: '/siswa',
                },
                {
                    name: 'Absensi',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chart-infographic" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M7 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                    <path d="M7 3v4h4"></path>
                    <path d="M9 17l0 4"></path>
                    <path d="M17 14l0 7"></path>
                    <path d="M13 13l0 8"></path>
                    <path d="M21 12l0 9"></path>
                 </svg>`,
                    route: '/siswa/absen'
                },
                {
                    name: 'Pembayaran',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-wallet" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12"></path>
                    <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4"></path>
                 </svg>`,
                    route: '#',
                    child: [
                        {
                            name: 'Pembayaran',
                            route: '/siswa/pembayaran/data'
                        },
                        {
                            name: 'Riwayat Transaksi',
                            route: '/siswa/pembayaran/transaksi'
                        }
                    ]
                }
            ]),
            role: 'Siswa'
        },
        {
            menu: JSON.stringify([
                {
                    name: 'Dashboard',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l-2 0l9 -9l9 9l-2 0" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" /></svg>`,
                    route: '/kurikulum',
                },
                {
                    name: 'Guru',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-user-star" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                    <path d="M6 21v-2a4 4 0 0 1 4 -4h.5"></path>
                    <path d="M17.8 20.817l-2.172 1.138a.392 .392 0 0 1 -.568 -.41l.415 -2.411l-1.757 -1.707a.389 .389 0 0 1 .217 -.665l2.428 -.352l1.086 -2.193a.392 .392 0 0 1 .702 0l1.086 2.193l2.428 .352a.39 .39 0 0 1 .217 .665l-1.757 1.707l.414 2.41a.39 .39 0 0 1 -.567 .411l-2.172 -1.138z"></path>
                </svg>`,
                    route: '#',
                    child: [
                        {
                            name: 'Data Guru',
                            route: '/kurikulum/guru/data',
                        },
                        {
                            name: 'Keuangan Guru',
                            route: '/kurikulum/guru/keuangan',
                        },
                    ]
                },
                {
                    name: 'Sekolah',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-bell-school" width="24" height="24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M10 10m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0"></path>
                    <path d="M13.5 15h.5a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-1a2 2 0 0 1 2 -2h.5"></path>
                    <path d="M16 17a5.698 5.698 0 0 0 4.467 -7.932l-.467 -1.068"></path>
                    <path d="M10 10v.01"></path>
                    <path d="M20 8m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                 </svg>`,
                    route: '#',
                    child: [
                        {
                            name: 'Jam Masuk & Piket',
                            route: '/kurikulum/sekolah/masuk',
                        },
                        {
                            name: 'Jam Pelajaran',
                            route: '/kurikulum/sekolah/jampel',
                        },
                        {
                            name: 'Libur',
                            route: '/kurikulum/sekolah/libur',
                        }
                    ]
                },
                {
                    name: 'Akademik',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chalkboard" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M8 19h-3a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v11a1 1 0 0 1 -1 1"></path>
                    <path d="M11 16m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
                </svg>`,
                    route: '#',
                    child: [
                        {
                            name: 'Jadwal Pelajaran',
                            route: '/kurikulum/akademik/jadwal'
                        },
                        {
                            name: 'Jurnal Kelas',
                            route: '/kurikulum/akademik/jurnal'
                        }
                    ]
                }
            ]),
            role: 'Kurikulum'
        },
        {
            menu: JSON.stringify([
                {
                    name: 'Dashboard',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l-2 0l9 -9l9 9l-2 0" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" /></svg>`,
                    route: '/kesiswaan',
                },
                {
                    name: 'Siswa',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-school" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M22 9l-10 -4l-10 4l10 4l10 -4v6"></path>
                <path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4"></path>
            </svg>`,
                    route: '#',
                    child: [
                        {
                            name: 'Kelas',
                            route: '/kesiswaan/siswa/kelas',
                        },
                        {
                            name: 'Data Siswa',
                            route: '/kesiswaan/siswa/data',
                        },
                        {
                            name: 'Absensi Siswa',
                            route: '/kesiswaan/siswa/absen',
                        },
                        {
                            name: 'Rekap Absensi Siswa',
                            route: '/kesiswaan/siswa/rekap',
                        }
                    ]
                },
                {
                    name: 'Sekolah',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-bell-school" width="24" height="24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M10 10m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0"></path>
                    <path d="M13.5 15h.5a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-1a2 2 0 0 1 2 -2h.5"></path>
                    <path d="M16 17a5.698 5.698 0 0 0 4.467 -7.932l-.467 -1.068"></path>
                    <path d="M10 10v.01"></path>
                    <path d="M20 8m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                 </svg>`,
                    route: '#',
                    child: [
                        {
                            name: 'Jam Masuk & Piket',
                            route: '/kesiswaan/sekolah/masuk',
                        },
                        {
                            name: 'Libur',
                            route: '/kesiswaan/sekolah/libur',
                        }
                    ]
                },
            ]),
            role: 'Kesiswaan'
        },
        {
            menu: JSON.stringify([
                {
                    name: 'Dashboard',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l-2 0l9 -9l9 9l-2 0" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" /></svg>`,
                    route: '/walas',
                },
            ]),
            role: 'Walas'
        },
        {
            menu: JSON.stringify([
                {
                    name: 'Dashboard',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l-2 0l9 -9l9 9l-2 0" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" /></svg>`,
                    route: '/piket',
                },
                {
                    name: 'Absen Siswa',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-school" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M22 9l-10 -4l-10 4l10 4l10 -4v6"></path>
                <path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4"></path>
            </svg>`,
                    route: '#',
                    child: [
                        {
                            name: 'Absensi Siswa',
                            route: '/piket/siswa/absen',
                        },
                        {
                            name: 'Rekap Absensi Siswa',
                            route: '/piket/siswa/rekap',
                        }
                    ]
                },
            ]),
            role: 'Piket'
        },
        {
            menu: JSON.stringify([
                {
                    name: 'Dashboard',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l-2 0l9 -9l9 9l-2 0" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" /></svg>`,
                    route: '/bendahara',
                },
                {
                    name: 'Pembayaran Siswa',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-wallet" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12"></path>
                    <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4"></path>
                 </svg>`,
                    route: '#',
                    child: [
                        {
                            name: 'Item Pembayaran',
                            route: '/bendahara/siswa/keuangan/pembayaran',
                        },
                        {
                            name: 'Riwayat Transaksi',
                            route: '/bendahara/siswa/keuangan/riwayat',
                        },
                        {
                            name: 'Transaksi',
                            route: '/bendahara/siswa/keuangan/transaksi',
                        },
                    ]
                },
                {
                    name: 'Keuangan Guru',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-user-dollar" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                    <path d="M6 21v-2a4 4 0 0 1 4 -4h3"></path>
                    <path d="M21 15h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5"></path>
                    <path d="M19 21v1m0 -8v1"></path>
                 </svg>`,
                    route: '/kurikulum/guru/keuangan',
                },
            ]),
            role: 'Bendahara'
        }
    ]

    await knex('navbar').insert(dataMenuSeeder)
};
