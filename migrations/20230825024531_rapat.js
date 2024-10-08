/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('rapat', function (table) {
        table.increments('id_rapat');
        table.string('judul');
        table.text('slug');
        table.date('tanggal');
        table.time('mulai');
        table.time('sampai');
        table.string('penyelenggara');
        table.text('kategori_peserta');
        table.json('peserta');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('rapat');
};
