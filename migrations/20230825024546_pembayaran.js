/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('pembayaran', function (table) {
        table.increments('id_pembayaran');
        table.string('nama_pembayaran');
        table.integer('nominal').nullable();
        table.json('kelas');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('pembayaran');
};
