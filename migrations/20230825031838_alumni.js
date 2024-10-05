/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('alumni', function (table) {
        table.string('nis').primary();
        table.integer('kelas_id').unsigned().nullable();
        table.string('tahun_lulus');
        table.string('kegiatan');
        table.foreign('nis').references('id_siswa').inTable('detail_siswa');
        table.foreign('kelas_id').references('id_kelas').inTable('kelas');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('alumni');
};
