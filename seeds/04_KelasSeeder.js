/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('kelas').del()
  await knex('kelas').insert([
    { tingkat: 'XII', jurusan: 'Utsman bin Affan', walas: 'arifubaidillah' },
    { tingkat: 'XII', jurusan: 'Ali bin Abi Thalib', walas: 'arifubaidillah' },
    { tingkat: 'XI', jurusan: 'Abu Bakar ash-Shiddiq', walas: 'arifubaidillah' },
    { tingkat: 'XI', jurusan: 'Umar bin Khattab', walas: 'arifubaidillah' },
    { tingkat: 'X', jurusan: 'Hasan bin Ali', walas: 'arifubaidillah' },
    { tingkat: 'X', jurusan: 'SP 2023 2', walas: 'arifubaidillah' },
  ]);
};
