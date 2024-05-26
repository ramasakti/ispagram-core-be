/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('kelas').del()
  await knex('kelas').insert([
    { tingkat: 'XII', jurusan: 'Utsman bin Affan', walas: 'masridwan' },
    { tingkat: 'XII', jurusan: 'Ali bin Abi Thalib', walas: 'maskhasila' },
    { tingkat: 'XI', jurusan: 'Abu Bakar ash-Shiddiq', walas: 'dewinfs' },
    { tingkat: 'XI', jurusan: 'Umar bin Khattab', walas: 'imamsulbani' },
    { tingkat: 'X', jurusan: 'Hasan bin Ali', walas: 'nenengaliyah79' },
    { tingkat: 'X', jurusan: 'SP 2023 2', walas: 'sudjono' },
  ]);
};
