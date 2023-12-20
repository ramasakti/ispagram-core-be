/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('pendidikan').del()
  const pendidikans = [
    { pendidikan: 'SD Sederajat / Paket A' },
    { pendidikan: 'SMP Sederajat / Paket B' },
    { pendidikan: 'SMA Sederajat / Paket C' },
    { pendidikan: 'S1' },
    { pendidikan: 'S2' },
    { pendidikan: 'S3' },
  ];
  await knex('pendidikan').insert(pendidikans);
};
