/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    knex.schema.createTable('jam_pelajaran', function (table) {
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
    knex.schema.dropTableIfExists('jam_pelajaran');
};
