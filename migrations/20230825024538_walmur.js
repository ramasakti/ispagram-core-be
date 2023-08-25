/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('walmur', function (table) {
        table.string('id_walmur').primary();
        table.string('siswa_id');
        table.text('nama_walmur');
        table.text('telp');

        table.foreign('siswa_id').references('id_siswa').inTable('siswa');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('walmur');
};
