/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('tunggakan', function (table) {
        table.increments('id');
        table.string('id_siswa');
        table.integer('pembayaran_id').unsigned();

        table.foreign('id_siswa').references('id_siswa').inTable('detail_siswa');
        table.foreign('pembayaran_id').references('id_pembayaran').inTable('pembayaran');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('tunggakan');
};
