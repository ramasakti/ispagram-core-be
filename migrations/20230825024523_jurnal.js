/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('jurnal', function (table) {
        table.increments('id_jurnal');
        table.date('tanggal');
        table.time('waktu');
        table.integer('jadwal_id').unsigned();
        table.boolean('inval');
        table.string('guru_id').nullable();
        table.text('materi');
        table.string('created_by');

        table.foreign('created_by').references('username').inTable('users');
        table.foreign('guru_id').references('id_guru').inTable('guru').onDelete('cascade').onUpdate('cascade');
        table.foreign('jadwal_id').references('id_jadwal').inTable('jadwal').onDelete('cascade').onUpdate('cascade');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('jurnal');
};
