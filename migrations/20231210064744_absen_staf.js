/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('absen_staf', function (table) {
        table.increments('id').primary();
        table.string('guru_id');
        table.date('tanggal');
        table.time('waktu');
        table.string('keterangan');
        table.foreign('guru_id').references('id_guru').inTable('guru').onDelete('cascade').onUpdate('cascade');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('absen_staf');
};
