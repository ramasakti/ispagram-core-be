/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('mapel', function (table) {
        table.increments('id_mapel').primary();
        table.string('nama_mapel');
        table.integer('kelas_id').unsigned();
        table.foreign('kelas_id').references('id_kelas').inTable('kelas').onDelete('cascade').onUpdate('cascade');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('mapel');
};
