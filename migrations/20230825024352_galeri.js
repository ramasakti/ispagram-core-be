/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('galeri', function (table) {
        table.increments('id_foto').primary();
        table.string('nama_foto');
        table.text('foto', 'longtext');
        table.string('caption');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('galeri');
};
