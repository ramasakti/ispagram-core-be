/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('kelas', function (table) {
        table.increments('id_kelas');
        table.string('tingkat');
        table.string('jurusan');
        table.string('walas');
        table.string('diniyah').nullable();
        table.foreign('walas').references('id_guru').inTable('guru');
        table.foreign('diniyah').references('id_guru').inTable('guru');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('kelas');
};
