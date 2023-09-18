/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('hari', function (table) {
        table.increments('id_hari');
        table.string('nama_hari');
        table.boolean('diniyah');
        table.json('jam_diniyah').nullable();
        table.time('masuk');
        table.json('istirahat');
        table.time('pulang');
        table.time('jampel');
        table.string('piket');
        table.boolean('status');

        table.foreign('piket').references('id_guru').inTable('guru');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('hari');
};
