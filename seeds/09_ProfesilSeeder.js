/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('profesi').del()
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
};
