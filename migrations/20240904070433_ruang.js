/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('ruang', function (table) {
        table.increments('id_ruang').primary();
        table.string('kode_ruang').unique();
        table.string('nama_ruang');
        table.string('lantai');
        table.integer('panjang');
        table.integer('lebar');
        table.integer('gedung_id').unsigned().nullable();

        table.foreign('gedung_id').references('id_gedung').inTable('gedung').onDelete('cascade').onUpdate('cascade');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('ruang');
};
