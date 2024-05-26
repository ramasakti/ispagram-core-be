/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('jadwal', function (table) {
        table.increments('id_jadwal');
        table.integer('jampel').unsigned();
        table.string('guru_id');
        table.integer('mapel').unsigned();
        table.string('status', 10).defaultTo('');

        table.foreign('jampel').references('id_jampel').inTable('jam_pelajaran').onDelete('cascade').onUpdate('cascade');
        table.foreign('guru_id').references('id_guru').inTable('guru').onDelete('cascade').onUpdate('cascade');
        table.foreign('mapel').references('id_mapel').inTable('mapel').onDelete('cascade').onUpdate('cascade');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('jadwal');
};
