/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    knex.schema.createTable('inval', function (table) {
        table.increments('id_inval');
        table.date('tanggal');
        table.integer('jadwal_id').unsigned();
        table.string('keterangan', 10);
        table.string('penginval');

        table.foreign('jadwal_id').references('id_jadwal').inTable('jadwal');
        table.foreign('penginval').references('id_guru').inTable('guru');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    knex.schema.dropTableIfExists('inval');
};
