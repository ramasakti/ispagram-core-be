/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('jurnal', function (table) {
        table.increments('id_jurnal');
        table.date('tanggal');
        table.integer('jadwal_id').unsigned();
        table.boolean('inval');
        table.boolean('transport');
        table.text('materi');

        table.foreign('jadwal_id').references('id_jadwal').inTable('jadwal');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('jurnal');
};
