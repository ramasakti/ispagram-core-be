/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('siswa', function (table) {
        table.string('id_siswa').primary();
        table.string('rfid').defaultTo('');
        table.integer('kelas_id').unsigned();
        table.foreign('id_siswa').references('username').inTable('users')
        table.foreign('kelas_id').references('id_kelas').inTable('kelas');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('siswa');
};
