/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('arsip_surat', function (table) {
        table.increments('id_arsip');
        table.date('tanggal');
        table.string('jenis', 1);
        table.string('nomor');
        table.string('perihal');
        table.text('url');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('arsip_surat');
};
