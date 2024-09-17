/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('inventaris', function (table) {
        table.increments('id_inventaris').primary();
        table.string('kode_inventaris').unique();
        table.string('nama_inventaris');
        table.string('tahun');
        table.integer('ruang_id').unsigned().nullable();

        table.foreign('ruang_id').references('id_ruang').inTable('ruang').onDelete('cascade').onUpdate('cascade');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('inventaris');
};
