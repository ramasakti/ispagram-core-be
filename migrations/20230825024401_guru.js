/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('guru', function (table) {
        table.string('id_guru').primary();
        table.boolean('staf').defaultTo(false);
        table.string('rfid').defaultTo('');
        table.string('nama_guru');
        table.text('alamat');
        table.string('telp');
        table.string('tempat_lahir');
        table.date('tanggal_lahir');
        table.foreign('id_guru').references('username').inTable('users');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('guru');
};
