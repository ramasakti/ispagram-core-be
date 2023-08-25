/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    knex.schema.createTable('pembayaran', function (table) {
        table.increments('id_pembayaran');
        table.string('nama_pembayaran');
        table.integer('nominal').nullable();
        table.text('kelas');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    knex.schema.dropTableIfExists('pembayaran');
};
