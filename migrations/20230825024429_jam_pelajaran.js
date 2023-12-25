/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('jam_pelajaran', function (table) {
        table.increments('id_jampel');
        table.string('hari');
        table.string('keterangan');
        table.time('mulai');
        table.time('selesai');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('jam_pelajaran');
};
