/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('kelas_pembayaran', function (table) {
        table.increments('id').primary();
        table.integer('pembayaran_id').unsigned();
        table.integer('kelas_id').unsigned();

        table.foreign('pembayaran_id').references('id_pembayaran').inTable('pembayaran');
        table.foreign('kelas_id').references('id_kelas').inTable('kelas');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('kelas_pembayaran');
};
