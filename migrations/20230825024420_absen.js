/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('absen', function (table) {
        table.string('id_siswa').primary();
        table.time('waktu_absen').nullable();
        table.date('izin').nullable();
        table.string('keterangan', 1);
        table.foreign('id_siswa').references('id_siswa').inTable('siswa');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('absen');
};
