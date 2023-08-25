/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('tunggakan', function (table) {
        table.string('siswa_id').primary();
        table.integer('tunggakan');

        table.foreign('siswa_id').references('id_siswa').inTable('siswa').onDelete('cascade').onUpdate('cascade');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('tunggakan');
};
