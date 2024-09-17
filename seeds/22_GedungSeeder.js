/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('gedung').del()
  await knex('gedung').insert([
    {id_gedung: 1, nama_gedung: 'GKB 1'},
    {id_gedung: 2, nama_gedung: 'GKB 2'},
    {id_gedung: 3, nama_gedung: 'GKB 3'}
  ]);
};
