/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('alumni', function (table) {
        table.string('nis').primary();
        table.string('tahun_lulus');
        table.string('kegiatan');
        table.foreign('nis').references('id_siswa').inTable('detail_siswa');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('alumni');
};
