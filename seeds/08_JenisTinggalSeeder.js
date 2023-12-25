/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('jenis_tinggal').del()
  const jenisTinggal = [
    { jeting: 'Bersama Orang Tua' },
    { jeting: 'Bersama Kakek/Nenek/Kerabat' },
    { jeting: 'Pondok Pesantren' },
    { jeting: 'Kos / Kontrak Sendiri' },
  ];
  await knex('jenis_tinggal').insert(jenisTinggal);
};
