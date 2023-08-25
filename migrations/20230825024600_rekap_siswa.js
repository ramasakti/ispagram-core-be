/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('rekap_siswa', function (table) {
        table.increments();
        table.date('tanggal');
        table.string('siswa_id');
        table.string('keterangan', 1);
        table.time('waktu_absen').nullable();

        table.foreign('siswa_id').references('id_siswa').inTable('siswa').onDelete('cascade').onUpdate('cascade');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('rekap_siswa');
};
