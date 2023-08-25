/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('jadwal', function (table) {
        table.increments('id_jadwal');
        table.integer('jampel').unsigned();
        table.string('guru_id');
        table.integer('kelas_id').unsigned();
        table.string('mapel');
        table.string('status', 10).defaultTo('');

        table.foreign('jampel').references('id_jampel').inTable('jam_pelajaran');
        table.foreign('guru_id').references('id_guru').inTable('guru');
        table.foreign('kelas_id').references('id_kelas').inTable('kelas');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('jadwal');
};
