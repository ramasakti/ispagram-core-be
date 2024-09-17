/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('kerusakan_inventaris', function (table) {
        table.increments('id_kerusakan').primary();
        table.date('tanggal_rusak');
        table.string('keterangan');
        table.integer('inventaris_id').unsigned().nullable();

        table.foreign('inventaris_id').references('id_inventaris').inTable('inventaris').onDelete('cascade').onUpdate('cascade');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('kerusakan_inventaris');
};
