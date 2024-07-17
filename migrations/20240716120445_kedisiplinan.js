/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('kedisiplinan', function (table) {
        table.increments('id_kedisiplinan').primary();
        table.string('siswa_id');
        table.integer('point');
        table.date('tanggal');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('kedisiplinan');
};
