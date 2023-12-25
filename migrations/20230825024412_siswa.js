/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('siswa', function (table) {
        table.string('id_siswa').primary();
        table.string('rfid').defaultTo('');
        table.string('nama_siswa');
        table.integer('kelas_id').unsigned();
        table.string('alamat');
        table.text('telp');
        table.string('tempat_lahir');
        table.date('tanggal_lahir').nullable();
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
