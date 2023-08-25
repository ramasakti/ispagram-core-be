/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    knex.schema.createTable('alumni', function (table) {
        table.string('nis').primary();
        table.string('nama');
        table.string('kegiatan');
        table.integer('tunggakan');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    knex.schema.dropTableIfExists('alumni');
};
