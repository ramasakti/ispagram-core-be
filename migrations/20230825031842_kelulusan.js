/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    knex.schema.createTable('kelulusan', function (table) {
        table.string('nisn').primary();
        table.boolean('lulus');
        table.string('siswa_id');
    })

    knex.schema.table('kelulusan', function (table) {
        table.foreign('siswa_id').references('id_siswa').inTable('siswa');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    knex.schema.dropTableIfExists('kelulusan');
};
