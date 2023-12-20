/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('transportasi').del()
  const transports = [
    { transport: 'Jalan Kaki' },
    { transport: 'Sepeda' },
    { transport: 'Sepeda Motor' },
    { transport: 'Antar Jemput' },
    { transport: 'Transportasi Umum (Ojek Online/Bus/Angkot/KRL)' },
  ];
  await knex('transportasi').insert(transports);
};
