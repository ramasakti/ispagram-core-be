/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('kelulusan', function (table) {
        table.string('nisn').primary();
        table.boolean('lulus');
        table.string('siswa_id');

        table.foreign('siswa_id').references('id_siswa').inTable('siswa');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('kelulusan');
};
