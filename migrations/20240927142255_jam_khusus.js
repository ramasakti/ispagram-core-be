/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('jam_khusus', function (table) {
        table.increments('id').primary();
        table.integer('hari_id').unsigned();
        table.string('keterangan');
        table.time('mulai');
        table.time('selesai');

        table.foreign('hari_id').references('id_hari').inTable('hari');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('jam_khusus');
};
